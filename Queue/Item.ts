import * as http from "cloudly-http"

export interface Item {
	hook: string
	value: http.Request
}

export namespace Item {
	export function is(value: Item | any): value is Item {
		return typeof value == "object" && typeof value.hook == "string" && http.Request.is(value.value)
	}
}
