import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function remove(request: http.Request, context: Context): Promise<model.Item | gracely.Error> {
	let result: model.Item | gracely.Error
	let destinations: gracely.Error | model.Registration[]
	const hooks = context.hooks
	const id = request.parameter.id
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!id || id.length != 1 || id < "a" || id > "f")
		result = gracely.client.invalidPathArgument("item/:id", "id", "string", "A valid identifier is required.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else if (gracely.Error.is((destinations = await context.destinations)))
		result = destinations
	else {
		result = { id, number: id.charCodeAt(0) - "a".charCodeAt(0) }
		destinations
			.filter(registration => registration.hook == "item-remove")
			.forEach(registration => hooks.trigger(registration.destination, result))
	}
	return result
}
router.add("DELETE", "/item/:id", remove)
