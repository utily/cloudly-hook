import * as gracely from "gracely"
import * as hook from "cloudly-hook"
import * as http from "cloudly-http"
import { KeyValueStore } from "cloudly-storage"
import { Registration } from "../model"
import { router } from "../router"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		return (
			this.#hooks ??
			(this.#hooks =
				hook.Hooks.open(this.environment.hookNamespace) ??
				gracely.server.misconfigured("namespace", "Hook queue namespace not correctly configured."))
		)
	}
	#destinations?: Promise<Registration[]>
	get destinations(): Promise<Registration[]> {
		return (
			this.#destinations ??
			(this.#destinations = this.store.list().then(data => data.map(data => data.value).filter(Registration.is)))
		)
	}
	private constructor(
		public readonly environment: Context.Environment,
		private readonly store: KeyValueStore<Registration>
	) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
	static async handle(request: Request, environment: Context.Environment): Promise<Response> {
		let result: http.Response
		try {
			const store = environment.destinationNamespace
				? KeyValueStore.Json.create(environment.destinationNamespace)
				: gracely.server.misconfigured("destinationStore", "Environment variable is missing.")
			result = gracely.Error.is(store)
				? http.Response.create(store)
				: await router.handle(http.Request.from(request), new Context(environment, store))
		} catch (e) {
			const details = (typeof e == "object" && e && e.toString()) || undefined
			result = http.Response.create(gracely.server.unknown(details, "exception"))
		}
		return http.Response.to(result)
	}
	async listen(listener: Registration): Promise<void> {
		this.store.set(listener.hook, listener)
	}
}

export namespace Context {
	export type Environment = ContextEnvironment
	export type Hooks = hook.Hooks
}
