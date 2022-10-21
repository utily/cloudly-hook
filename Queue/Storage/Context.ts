import * as gracely from "gracely"
import * as isoly from "isoly"
import * as http from "cloudly-http"
import * as platform from "../../platform"

export class Context {
	private constructor(private readonly state: platform.DurableObjectState, private readonly MAX_RETRIES = 5) {}
	async enqueue(hook: http.Request): Promise<void> {
		this.tryEnqueue(hook)
	}
	private async tryEnqueue(hook: http.Request, retries = 0, timeInSeconds = 10): Promise<void> {
		// let index = await this.state.storage.get<number>("index")
		// index = typeof index == "number" ? ++index : 0
		console.log("inside enqueue", this.state.id)
		await this.state.storage.put(`hook`, { hook, retries })
		// await this.state.storage.put("index", index)
		this.state.waitUntil(
			this.state.storage.setAlarm(
				isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), timeInSeconds), "milliseconds")
			)
		)
	}
	async dequeue(): Promise<http.Response | gracely.Error> {
		let result: http.Response | gracely.Error
		// let index: number | undefined
		let item: { hook: http.Request; retries: number } | undefined
		if (
			/* typeof (index = await this.state.storage.get<number>("index")) == "undefined" || */
			!(item = await this.state.storage.get<{ hook: http.Request; retries: number }>(`hook`))
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			console.log("inside dequeue:", item)
			result = await this.send(item.hook)
			await this.state.storage.delete(`hook`)
			// await this.state.storage.put("index", --index)
			if (gracely.Error.is(result) && item.retries < this.MAX_RETRIES)
				this.tryEnqueue(item.hook, ++item.retries)
			// else {
			// 	if (index >= 0)
			// 		this.state.storage.setAlarm(
			// 			isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), 10), "milliseconds")
			// 		)
			// }
		}
		return result
	}
	static open(state: platform.DurableObjectState): Context {
		return new Context(state)
	}
	async send(item: http.Request): Promise<http.Response | gracely.Error> {
		const response = await http.fetch(item)
		return response.status < 400 ? response : gracely.server.unavailable("request unsuccessful")
	}
}
