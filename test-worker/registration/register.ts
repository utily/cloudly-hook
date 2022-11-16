import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function register(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const registration = await request.body
	const hooks = context.hooks
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Registration.is(registration))
		result = gracely.client.invalidContent("Registration", "Body is not a valid registration.")
	else if (gracely.Error.is(hooks))
		result = hooks
	else {
		result = await hooks.register(registration.hook, registration.id, registration.destination)
	}
	return result
}
router.add("POST", "/register", register)
