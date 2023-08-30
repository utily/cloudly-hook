import { Context } from "./Context"
import { router } from "./router"

import "./item"
import "./version"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.open(environment).handle(request, router)
	},
}
