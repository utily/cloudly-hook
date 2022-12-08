import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const message = await request.body
	if (!message.url) {
		result = gracely.client.invalidContent("Request", "Body does not contain a target URl.")
	} else {
		await context.enqueue(message)
		result = gracely.success.created(message)
	}
	return result
}
router.add("POST", "/queue", create)
