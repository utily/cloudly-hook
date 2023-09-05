import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Types } from "../../../Types"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Error | Types.EventBase
	const event = await request.body
	if (!Types.EventBase.is(event)) {
		result = gracely.client.flawedContent(Types.EventBase.type.flaw(event))
	} else {
		await context.enqueue(event)
		result = event
	}
	return result
}
router.add("POST", "/queue", create)
