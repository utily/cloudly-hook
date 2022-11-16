import { HookStorage } from "cloudly-hook"
import { Context } from "./Context"

import "./item"
import "./version"
import "./registration"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.handle(request, environment)
	},
}
export { HookStorage }
