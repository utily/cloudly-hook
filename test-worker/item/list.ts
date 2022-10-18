import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function list(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: model.Item[] | gracely.Error
	const authorization = request.header.authorization
	if (!authorization)
		result = gracely.client.unauthorized()
	else
		result = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((id, number) => ({ id, number }))
	return result
}
router.add("GET", "/item", list)
