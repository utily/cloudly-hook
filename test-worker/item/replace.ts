import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function replace(request: http.Request, context: Context): Promise<model.Item | gracely.Error> {
	let result: model.Item | gracely.Error
	const id = request.parameter.id
	const item = await request.body
	const hooks = context.hooks
	let destinations: gracely.Error | model.Registration[]
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!id || id.length != 1 || id < "a" || id > "f")
		result = gracely.client.invalidPathArgument("item/:id", "id", "string", "A valid identifier is required.")
	else if (!model.Item.is(item))
		result = gracely.client.invalidContent("Item", "Body is not a valid item.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else if (gracely.Error.is((destinations = await context.destinations)))
		result = destinations
	else {
		result = item
		destinations
			.filter(registration => registration.hook == "item-replace")
			.forEach(registration => hooks.trigger(registration.destination, item))
	}
	return result
}
router.add("PUT", "/item/:id", replace)
