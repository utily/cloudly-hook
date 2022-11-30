import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const item = await request.body
	const hooks = context.hooks
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Item.is(item))
		result = gracely.client.invalidContent("Item", "Body is not a valid item.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else {
		hooks.trigger(`item-create/${item.id}`, item)
		result = gracely.success.created(item)
	}
	return result
}
router.add("POST", "/item", create)
