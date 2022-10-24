import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const item = await request.body
	if (!http.Request.is(item))
		result = gracely.client.invalidContent("Item", "Body is not a valid item.")
	else {
		console.log("enqueue", item, context)
		await context.enqueue(item)
		result = gracely.success.created(item)
	}
	return result
}
router.add("POST", "/queue", create)
