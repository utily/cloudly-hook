import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Types } from "../../../Types"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<gracely.Error | Types.EventBase[]> {
	let result: gracely.Error | Types.EventBase[]
	const events = await request.body
	if (!Types.EventBase.type.array().is(events)) {
		result = gracely.client.flawedContent(Types.EventBase.type.array().flaw(events))
	} else {
		await context.trigger(events.map((e, index) => ({ ...e, index })))
		result = events
	}
	return result
}
router.add("POST", "/queue", create)
