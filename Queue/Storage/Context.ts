import * as gracely from "gracely"
import * as isoly from "isoly"
import * as http from "cloudly-http"
import * as platform from "../../platform"
import { Item } from "../Item"

export class Context {
	private constructor(private readonly state: platform.DurableObjectState, private readonly MAX_RETRIES = 5) {}
	async enqueue(hook: Item, retries = 0, timeInSeconds = 3): Promise<void> {
		let index = await this.state.storage.get<number>("index")
		index = typeof index == "number" ? ++index : 0
		console.log("inside enqueue", index)
		console.log("ID: ", this.state.id)
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
		let data: { item: Item; retries: number } | undefined
		if (
			typeof (index = await this.state.storage.get<number>("index")) == "undefined" ||
			!(data = await this.state.storage.get<{ item: Item; retries: number }>(`hook${index}`))
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			console.log("inside dequeue", index)
			console.log("execute callback", data)
			result = await this.send(data.item)
			await this.state.storage.delete(`hook${index}`)
			await this.state.storage.put("index", --index)
			if (gracely.Error.is(result) && data.retries < this.MAX_RETRIES)
				this.enqueue(data.item, ++data.retries)
			else {
				if (index >= 0)
					this.state.storage.setAlarm(
						isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), 3), "milliseconds")
					)
			}
		}
		return result
	}
	static open(state: platform.DurableObjectState): Context {
		return new Context(state)
	}
	async send(item: Item) {
		return item.target()
	}
	async alarm(): Promise<void> {
		console.log("context alarm triggered")
		this.dequeue()
	}
}
