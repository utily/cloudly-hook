import * as isoly from "isoly"
import * as cloudflare from "@cloudflare/workers-types"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Types } from "../../Types"

export class Context {
	readonly alarm = new storage.DurableObject.Alarm(this.state.storage)
	private nextAlarm: number | undefined
	private constructor(private readonly state: cloudflare.DurableObjectState, private readonly now: isoly.DateTime) {}

	async trigger(events: Types.EventBase[]): Promise<void> {
		await Promise.all(events.map(event => this.sendOrSnooze(event)))
		typeof this.nextAlarm == "number" && (await this.alarm.set("retry", this.nextAlarm), (this.nextAlarm = undefined))
	}
	private async sendOrSnooze(event: Types.EventBase): Promise<void> {
		if (event.retries < event.options.maxRetries && !(await this.send(event))) {
			event.alarm = isoly.DateTime.epoch(
				isoly.DateTime.nextSecond(this.now, event.options.timeFactor * ++event.retries),
				"milliseconds"
			)
			await this.state.storage.put(`hook|${event.index}`, { ...event, retries: event.retries })
			this.nextAlarm = this.nextAlarm && this.nextAlarm <= event.alarm ? this.nextAlarm : event.alarm
		} else
			await this.state.storage.delete(`hook|${event.index}`)
	}
	async retry(): Promise<void> {
		await this.trigger([...(await this.state.storage.list<Types.EventBase>({ prefix: `hook|` })).values()])
	}
	async send(event: Types.EventBase): Promise<boolean> {
		return await http.fetch(Types.EventBase.toRequest(event)).then(r => r.status >= 200 && r.status < 300)
	}
	static open(state: cloudflare.DurableObjectState): Context {
		return new Context(state, isoly.DateTime.now())
	}
}
