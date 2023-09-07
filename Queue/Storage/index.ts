import "./queue"
import * as cloudflare from "@cloudflare/workers-types"
import { http } from "cloudly-http"
import { Context } from "./Context"
import { router } from "./router"

export class Storage {
	private readonly context: Context
	private constructor(readonly state: cloudflare.DurableObjectState) {
		this.context = Context.open(state)
	}
	async fetch(request: Request): Promise<Response> {
		return http.Response.to(await router.handle(http.Request.from(request), this.context))
	}
	async alarm(): Promise<void> {
		this.context.alarm.register("retry", async () => {
			this.context.retry()
		})
		await this.context.alarm.handle()
	}
}
