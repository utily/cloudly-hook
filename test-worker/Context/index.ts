import * as gracely from "gracely"
import * as hook from "cloudly-hook"
import { http } from "cloudly-http"
import { Router } from "cloudly-router"
import { storage } from "cloudly-storage"
import { Registration } from "../model"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	private constructor(public readonly environment: Context.Environment) {}
	#store?: storage.KeyValueStore<Registration>
	get store(): storage.KeyValueStore<Registration> | gracely.Error {
		return (
			this.#store ||
			(this.environment.destinationNamespace
				? (this.#store = storage.KeyValueStore.Json.create(
						storage.KeyValueStore.open(this.environment.destinationNamespace)
				  ))
				: gracely.server.misconfigured("destinationNamespace", "Environment variable is missing."))
		)
	}
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		return (this.#hooks ??=
			hook.Hooks.open(this.environment.hookNamespace) ??
			gracely.server.misconfigured("hookNamespace", "Hook queue namespace not correctly configured."))
	}
	get destinations(): Promise<Registration[] | gracely.Error> {
		let store: storage.KeyValueStore<Registration> | gracely.Error
		return !gracely.Error.is((store = this.store))
			? store.list().then(data => data.map(data => data.value).filter(Registration.is))
			: Promise.resolve(store)
	}
	async listen(listener: Registration): Promise<Registration | gracely.Error> {
		let store: storage.KeyValueStore<Registration> | gracely.Error
		return gracely.Error.is((store = this.store)) ? store : (store.set(listener.hook, listener), listener)
	}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
	async handle(request: Request, router: Router<Context>): Promise<Response> {
		return await router.handle(request, this)
	}
	static open(environment: Context.Environment): Context {
		return new Context(environment)
	}
}
export namespace Context {
	export type Environment = ContextEnvironment
	export type Hooks = hook.Hooks
}
