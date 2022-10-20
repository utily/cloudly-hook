import * as gracely from "gracely"
import * as isoly from "isoly"
import * as http from "cloudly-http"
import * as platform from "../../platform"
import { Item } from "../Item"

export class Context {
	private constructor(
		private readonly state: platform.DurableObjectState,
		private readonly url: URL,
		private readonly MAX_RETRIES = 5
	) {}
	async enqueue(hook: Item, retries = 0, timeInSeconds = 10): Promise<void> {
		let index = await this.state.storage.get<number>("index")
		index = typeof index == "number" ? ++index : 0
		console.log("inside enqueue", index)
		await this.state.storage.put(`hook${index}`, { hook, retries })
		await this.state.storage.put("index", index)
		this.state.waitUntil(
			this.state.storage.setAlarm(
				isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), timeInSeconds), "milliseconds")
			)
		)
	}
	async dequeue(): Promise<Item | gracely.Error> {
		let result: Item | gracely.Error
		let index: number | undefined
		let item: { hook: Item; retries: number } | undefined
		if (
			typeof (index = await this.state.storage.get<number>("index")) == "undefined" ||
			!(item = await this.state.storage.get<{ hook: Item; retries: number }>(`hook${index}`))
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			console.log("inside dequeue", index)
			console.log("execute callback", item)
			result = await this.send(item.hook)
			await this.state.storage.delete(`hook${index}`)
			await this.state.storage.put("index", --index)
			if (gracely.Error.is(result) && item.retries < this.MAX_RETRIES)
				this.enqueue(item.hook, ++item.retries)
			else {
				if (index >= 0)
					this.state.storage.setAlarm(
						isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), 10), "milliseconds")
					)
			}
		}
		return result
	}
	static open(state: platform.DurableObjectState, url: string): Context {
		return new Context(state, new URL(url))
	}
	async send(item: Item) {
		const response = await http.fetch({
			method: "POST",
			url: this.url.toString(),
			body: item,
			header: { contentType: "application/json;charset=UTF-8" },
		})
		console.log("inside send", response.status)
		return response.status < 400 ? item : gracely.server.unavailable("request unsuccessful")
	}
	async alarm(): Promise<void> {
		console.log("context alarm triggered")
		this.dequeue()
	}
}
