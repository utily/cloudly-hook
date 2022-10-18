import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function change(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: model.Item | gracely.Error
	const id = request.parameter.id
	const item = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!id || id.length != 1 || id < "a" || id > "f")
		result = gracely.client.invalidPathArgument("item/:id", "id", "string", "A valid identifier is required.")
	else if (!model.Item.is(item))
		result = gracely.client.invalidContent("Item", "Body is not a valid item.")
	else
		result = { ...item, id }
	return result
}
router.add("PATCH", "/item/:id", change)
