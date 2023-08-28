import { gracely } from "gracely"
import * as isoly from "isoly"
import { http } from "cloudly-http"

export class Context {
	private constructor(
		private readonly state: DurableObjectState,
		private readonly maxRetries = 5,
		private readonly timeFactor = 1
	) {}
	async enqueue(request: http.Request.Like): Promise<void> {
		this.tryEnqueue(request)
	}
	private async tryEnqueue(request: http.Request.Like, retries = 0): Promise<void> {
		await this.state.storage.put(`hook`, { request: request, retries: retries })
		this.state.waitUntil(
			this.state.storage.setAlarm(
				isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), this.timeFactor * retries), "milliseconds")
			)
		)
	}
	async dequeue(): Promise<http.Response | gracely.Error> {
		let result: http.Response | gracely.Error
		let data: { request: http.Request.Like; retries: number } | undefined
		if (
			!(data = await this.state.storage.get<{ request: http.Request.Like; retries: number }>(`hook`)) ||
			!data.request
		)
			result = gracely.server.databaseFailure("item not found")
		else {
			result = await this.send(data.request)
			await this.state.storage.delete(`hook`)
			if (gracely.Error.is(result) && data.retries < this.maxRetries)
				this.tryEnqueue(data.request, ++data.retries)
		}
		return result
	}
	static open(state: DurableObjectState, maxRetries?: number, timeFactor?: number): Context {
		return new Context(state, maxRetries, timeFactor)
	}
	async send(request: http.Request.Like): Promise<http.Response | gracely.Error> {
		const response = await http.fetch(request)
		return gracely.Error.is(response.body) ? response.body : response
	}
}
