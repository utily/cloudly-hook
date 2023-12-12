import { http } from "cloudly-http"
import { isly } from "isly"
import { Registration } from "./Registration"

export interface EventBase<T extends string = string> extends Registration<T> {
	body: EventBase.Body
	options: EventBase.Options
	retries: number
	alarm?: number
	index: number
}

export namespace EventBase {
	export type Body = string | number | boolean | { [key: string]: Body } | Body[]
	export type Options = { maxRetries: number; timeFactor: number }
	export const defaultOptions = { maxRetries: 5, timeFactor: 5 }
	export function toRequest(event: EventBase): http.Request {
		return http.Request.create({
			method: "POST",
			url: event.url,
			header: { contentType: "application/json", ...event.header },
			body: event.body,
		})
	}
	export const type = Registration.type.extend<EventBase>({
		body: isly.any(),
		options: isly.object<Extract<EventBase, "options">>({ maxRetries: isly.number(), timeFactor: isly.number() }),
		retries: isly.number(),
		alarm: isly.number().optional(),
		index: isly.number(),
	})
	export const is = type.is
}
