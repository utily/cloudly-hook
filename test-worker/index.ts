import * as hook from "cloudly-hook"
import { Context } from "./Context"
import { router } from "./router"

import "./item"
import "./version"
import "./registration"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.open(environment).handle(request, router)
	},
}
const Hooks = hook.Hooks
const HookStorage = hook.HookStorage
export { Hooks, HookStorage }
