import * as gracely from "gracely"
import * as isoly from "isoly"
import * as http from "cloudly-http"
import * as platform from "../../platform"
import { Item } from "../Item"

export class Context {
	private constructor(private readonly state: platform.DurableObjectState) {}
	async enqueue(hook: Item): Promise<void> {
		let index = await this.state.storage.get<number>("index")
		index = typeof index == "number" ? ++index : 0
		console.log(index)
		console.log("state: ", this.state.id)
		await this.state.storage.put(`hook${index}`, hook)
		await this.state.storage.put("index", index)
		this.state.waitUntil(
			this.state.storage.setAlarm(
				isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), 10), "milliseconds")
			)
		)
	}
	async dequeue(): Promise<Item | gracely.Error> {
		let result: Item | gracely.Error
		let index: number | undefined
		let item: Item | undefined
		if (
			typeof (index = await this.state.storage.get<number>("index")) == "undefined" ||
			!(item = await this.state.storage.get<Item>(`hook${index}`))
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			console.log("execute callback", item)
			console.log(index)
			result = await this.send(item)
			await this.state.storage.delete(`hook${index}`) // TODO: or reschedule alarm
			await this.state.storage.put("index", --index)
			if (index >= 0)
				this.state.storage.setAlarm(
					isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), 10), "milliseconds")
				)
		}
		return result
	}
	static open(state: platform.DurableObjectState): Context {
		return new Context(state)
	}
	async send(item: Item) {
		const response = await http.fetch({
			method: "POST",
			url: "https://ptsv2.com/t/8vc2v-1666168541/post",
			body: item,
			header: { contentType: "application/json;charset=UTF-8" },
		})
		return response.status < 400 ? item : gracely.server.unavailable("request unsuccessful")
	}
}
