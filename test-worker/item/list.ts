import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function list(request: http.Request, context: Context): Promise<model.Item[] | gracely.Error> {
	let result: model.Item[] | gracely.Error
	let destinations: gracely.Error | model.Registration[]
	const hooks = context.hooks
	const authorization = request.header.authorization
	if (!authorization)
		result = gracely.client.unauthorized()
	else if (gracely.Error.is(hooks))
		result = hooks
	else if (gracely.Error.is((destinations = await context.destinations)))
		result = destinations
	else
		result = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id, number) => ({ id, number }))
	return result
}
router.add("GET", "/item", list)
