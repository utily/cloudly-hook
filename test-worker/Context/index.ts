import * as gracely from "gracely"
import * as hook from "cloudly-hook"
import * as http from "cloudly-http"
import { router } from "../router"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		return (
			this.#hooks ??
			(this.#hooks =
				hook.Hooks.open(this.environment.hookNamespace, Context.Destinations) ??
				gracely.server.misconfigured("hookNamespace", "Hook queue namespace not correctly configured."))
		)
	}
	constructor(public readonly environment: Context.Environment) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
	static async handle(request: Request, environment: Context.Environment): Promise<Response> {
		let result: http.Response
		try {
			result = await router.handle(http.Request.from(request), new Context(environment))
		} catch (e) {
			const details = (typeof e == "object" && e && e.toString()) || undefined
			result = http.Response.create(gracely.server.unknown(details, "exception"))
		}
		return http.Response.to(result)
	}
}

export namespace Context {
	export type Environment = ContextEnvironment
	export type Hooks = hook.Hooks<{
		"item-create": http.Request
		"item-change": http.Request
		"item-fetch": http.Request
		"item-remove": http.Request
		"item-replace": http.Request
		"item-list": http.Request
	}>
	export const Destinations = {
		"item-create": "https://ptsv2.com/t/42xbq-1666270086/post",
		"item-change": "https://ptsv2.com/t/42xbq-1666270086/post",
		"item-fetch": "https://ptsv2.com/t/42xbq-1666270086/post",
		"item-remove": "https://ptsv2.com/t/42xbq-1666270086/post",
		"item-replace": "https://ptsv2.com/t/42xbq-1666270086/post",
		"item-list": "https://ptsv2.com/t/42xbq-1666270086/post",
	}
}
