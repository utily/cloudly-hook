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

export const Hooks = hook.Hooks
export const HookStorage = hook.HookStorage
