import "./queue"
import * as http from "cloudly-http"
import * as platform from "../../platform"
import { Context } from "./Context"
import { router } from "./router"

export class Storage {
	private readonly context: Context
	private constructor(state: platform.DurableObjectState) {
		this.context = Context.open(state)
	}
	async fetch(request: Request): Promise<Response> {
		return http.Response.to(await router.handle(http.Request.from(request), this.context))
	}
	async alarm(): Promise<void> {
		console.log("alarm triggered")
		this.context.alarm()
	}
}
