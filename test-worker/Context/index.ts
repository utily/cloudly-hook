import * as gracely from "gracely"
import * as hook from "cloudly-hook"
import { http } from "cloudly-http"
import { Router } from "cloudly-router"
import { storage } from "cloudly-storage"
import * as model from "../model"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	private constructor(public readonly environment: Context.Environment) {}
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		let namespace: storage.DurableObject.Namespace | undefined
		return (this.#hooks ??=
			((namespace = storage.DurableObject.Namespace.open(this.environment.hookNamespace)) &&
				hook.Hooks.open<model.Hooks>(
					namespace,
					this.environment.destinationNamespace &&
						storage.KeyValueStore.Json.create(storage.KeyValueStore.open(this.environment.destinationNamespace))
				)) ||
			gracely.server.misconfigured("hookNamespace", "Hook queue namespace not correctly configured."))
	}
	async listen(listener: model.Hooks.Registration): Promise<model.Hooks.Registration | gracely.Error> {
		let hooks: Context.Hooks | gracely.Error
		return gracely.Error.is((hooks = this.hooks))
			? hooks
			: (await hooks.register(listener))
			? listener
			: gracely.server.unavailable("Unable to register listener.")
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
	export type Hooks = hook.Hooks<model.Hooks>
}
