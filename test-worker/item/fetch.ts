import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function fetch(request: http.Request, context: Context): Promise<model.Item | gracely.Error> {
	let result: model.Item | gracely.Error
	const hooks = context.hooks
	const id = request.parameter.id
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!id || id.length != 1 || id < "a" || id > "f")
		result = gracely.client.invalidPathArgument("item/:id", "id", "string", "A valid identifier is required.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else {
		result = { id, number: id.charCodeAt(0) - "a".charCodeAt(0) }
		await hooks.trigger("item-fetch", result)
	}
	return result
}
router.add("GET", "/item/:id", fetch)
