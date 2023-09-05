import { isly } from "isly"
import { Registration } from "./Registration"

export interface EventBase<T extends string = string> extends Registration<T> {
	body: EventBase.Body
	options?: EventBase.Options
}

export namespace EventBase {
	export type Body = string | number | boolean | { [key: string]: Body } | Body[]
	export type Options = { maxRetries: number; timeFactor: number }
	export const type = Registration.type.extend<EventBase>({
		body: isly.any(),
		options: isly
			.object<Extract<EventBase, "options">>({ maxRetries: isly.number(), timeFactor: isly.number() })
			.optional(),
	})
	export const is = type.is
}
