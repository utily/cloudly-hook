import "./queue"
import * as cloudflare from "@cloudflare/workers-types"
import { Context } from "./Context"
import { router } from "./router"

export class Storage implements cloudflare.DurableObject {
	private readonly context: Context
	private constructor(readonly state: cloudflare.DurableObjectState) {
		this.context = Context.open(state)
	}
	async fetch(request: cloudflare.Request): Promise<cloudflare.Response> {
		return (await router.handle(request, this.context)) as any as cloudflare.Response
	}
	async alarm(): Promise<void> {
		this.context.dequeue()
	}
}
