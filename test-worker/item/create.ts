import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<model.Item | gracely.Error> {
	let result: model.Item | gracely.Error
	let destinations: gracely.Error | model.Registration[]
	const hooks = context.hooks
	const item = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Item.is(item))
		result = gracely.client.invalidContent("Item", "Body is not a valid item.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else if (gracely.Error.is((destinations = await context.destinations)))
		result = destinations
	else {
		result = item
		destinations
			.filter(registration => registration.hook == "item-create")
			.forEach(registration => hooks.trigger(registration.destination, item))
	}
	return result
}
router.add("POST", "/item", create)
