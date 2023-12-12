import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "./Context"
import { router } from "./router"

export async function create(request: http.Request, context: Context): Promise<any | gracely.Error> {
	let result: string | gracely.Error
	if (gracely.Error.is(context.hooks))
		result = context.hooks
	else {
		await context.hooks.queue.enqueue([
			{
				body: "aaaa",
				url: "https://webhook.site/68fb4dbb-b480-4b9b-acb1-63803eab96a0",
				options: { maxRetries: 20, timeFactor: 10 },
				retries: 0,
				index: 0,
				hook: "",
				header: { contentType: "application/jwt; charset=utf-8" },
			},
		])
		result = "aaaa"
	}
	return result
}
router.add("POST", "/event", create)
