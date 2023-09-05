import * as gracely from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function register(
	request: http.Request,
	context: Context
): Promise<model.Hooks.Registration | gracely.Error> {
	let result: model.Hooks.Registration | gracely.Error
	const registration = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Hooks.Registration.is(registration))
		result = gracely.client.invalidContent("Registration", "Body is not a valid registration.")
	else {
		result = await context.listen(registration)
	}
	return result
}
router.add("POST", "/register", register)
