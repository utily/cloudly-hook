import { Hooks as CloudlyHook } from "cloudly-hook"
import { isly } from "isly"

export type Hooks = typeof Hooks.triggers[number]

export namespace Hooks {
	export const triggers = [
		"item-create",
		"item-change",
		"item-fetch",
		"item-remove",
		"item-replace",
		"item-list",
	] as const
	export const type = isly.string(triggers)
	export const is = type.is
	export type Registration = CloudlyHook.Registration<Hooks>
	export namespace Registration {
		export const type = CloudlyHook.Registration.type.extend<Registration>({ hook: isly.string(triggers) })
		export const is = type.is
	}
	export type Event = CloudlyHook.Event<Hooks>
	export namespace Event {
		export const type = CloudlyHook.Event.type.extend<Event>({ hook: isly.string(triggers) })
		export const is = type.is
	}
}
