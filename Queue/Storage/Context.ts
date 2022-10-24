import * as gracely from "gracely"
import * as isoly from "isoly"
import * as http from "cloudly-http"
import * as platform from "../../platform"
import { Item } from "../Item"

export class Context {
	private constructor(
		private readonly state: platform.DurableObjectState,
		private readonly MAX_RETRIES = 5,
		private readonly timeInSeconds = 1
	) {}
	async enqueue(item: Item): Promise<void> {
		this.tryEnqueue(item)
	}
	private async tryEnqueue(item: Item, retries = 0): Promise<void> {
		await this.state.storage.put(`hook`, { item: item, retries: retries })
		this.state.waitUntil(
			this.state.storage.setAlarm(
				isoly.DateTime.epoch(
					isoly.DateTime.nextSecond(isoly.DateTime.now(), this.timeInSeconds * retries),
					"milliseconds"
				)
			)
		)
	}
	async dequeue(): Promise<http.Response | gracely.Error> {
		let result: http.Response | gracely.Error
		let data: { item: Item; retries: number } | undefined
		if (
			!(data = await this.state.storage.get<{ item: Item; retries: number }>(`hook`)) ||
			!data.item ||
			!Item.is(data.item)
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			result = await this.send(data.item)
			await this.state.storage.delete(`hook`)
			if (gracely.Error.is(result) && data.retries < this.MAX_RETRIES)
				this.tryEnqueue(data.item, ++data.retries)
		}
		return result
	}
	static open(state: platform.DurableObjectState): Context {
		return new Context(state)
	}
	async send(item: Item): Promise<http.Response | gracely.Error> {
		const response = await http.fetch(item.value)
		return gracely.Error.is(response.body) ? response.body : response
	}
}
