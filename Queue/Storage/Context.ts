import { gracely } from "gracely"
import * as isoly from "isoly"
import * as cloudflare from "@cloudflare/workers-types"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Types } from "../../Types"

export class Context {
	readonly alarm = new storage.DurableObject.Alarm(this.state.storage)
	private constructor(private readonly state: cloudflare.DurableObjectState) {}
	async enqueue(event: Types.EventBase): Promise<void> {
		const request: http.Request.Like = {
			method: "POST",
			url: event.url,
			body: { hook: event.hook, event: event.body },
			header: { ...event.header, contentType: "application/json" },
		}
		const maxRetries = event.options?.maxRetries ?? 5
		const timeFactor = event.options?.timeFactor ?? 1
		this.tryEnqueue(request, maxRetries, timeFactor)
	}
	private async tryEnqueue(
		request: http.Request.Like,
		maxRetries: number,
		timeFactor: number,
		retries = 0
	): Promise<void> {
		if (gracely.Error.is(await this.send(request))) {
			await this.state.storage.put(`hook`, { request, retries, maxRetries, timeFactor })
			await this.alarm.set(
				"dequeue",
				isoly.DateTime.epoch(isoly.DateTime.nextSecond(isoly.DateTime.now(), timeFactor * retries), "milliseconds")
			)
		}
	}
	async dequeue(): Promise<void> {
		let data: { request: http.Request.Like; maxRetries: number; timeFactor: number; retries: number } | undefined
		if (
			(data = await this.state.storage.get<{
				request: http.Request.Like
				retries: number
				maxRetries: number
				timeFactor: number
			}>(`hook`)) &&
			data.request
		) {
			const result = await this.send(data.request)
			await this.state.storage.delete(`hook`)
			if (gracely.Error.is(result) && data.retries < data.maxRetries)
				this.tryEnqueue(data.request, data.maxRetries, data.timeFactor, ++data.retries)
		}
	}
	static open(state: cloudflare.DurableObjectState): Context {
		return new Context(state)
	}
	async send(request: http.Request.Like): Promise<boolean> {
		const response = await http.fetch(request)
		return response.status == 200
	}
}
