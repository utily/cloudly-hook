import { http } from "cloudly-http"
import { isly } from "isly"

export interface Registration<T extends string = string> {
	hook: T
	url: string
	header?: http.Request.Header
}

export namespace Registration {
	export const type = isly.object<Registration>({
		hook: isly.string(),
		url: isly.string(/https:\/\//),
		header: isly.fromIs("http.request.Header", http.Request.Header.is).optional(),
	})
	export const is = type.is
}
