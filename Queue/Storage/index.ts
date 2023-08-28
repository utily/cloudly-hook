import "./queue"
import { Context } from "./Context"
import { router } from "./router"

export class Storage implements DurableObject {
	private readonly context: Context
	private constructor(readonly state: DurableObjectState) {
		this.context = Context.open(state)
	}
	async fetch(request: Request): Promise<Response> {
		return await router.handle(request, this.context)
	}
	async alarm(): Promise<void> {
		this.context.dequeue()
	}
}
