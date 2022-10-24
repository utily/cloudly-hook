import * as http from "cloudly-http"

export interface Item {
	hook: string
	value: http.Request.Like
}

export namespace Item {
	export function is(value: Item | any): value is Item {
		return typeof value == "object" && typeof value.hook == "string" && value.value.url
	}
}
