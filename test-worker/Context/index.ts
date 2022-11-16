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
				hook.Hooks.open(this.environment.hookNamespace, this.environment.destinationNamespace) ??
				gracely.server.misconfigured(
					"namespaces",
					"Hook queue namespace or hook destination namespace not correctly configured."
				))
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
	export type Hooks = hook.Hooks
}
