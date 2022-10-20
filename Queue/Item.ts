import type { Error } from "gracely"

export interface Item {
	hook: string
	value: any
	target(): Item | Error
}

export namespace Item {
	export function is(value: Item | any): value is Item {
		return typeof value == "object" && typeof value.hook == "string" && typeof value.target == "function"
	}
}
