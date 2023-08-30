import * as gracely from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function register(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const registration = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Registration.is(registration) || !validateURL(registration.destination))
		result = gracely.client.invalidContent("Registration", "Body is not a valid registration.")
	else {
		context.listen(registration)
		result = gracely.success.created(registration)
	}
	return result
}
router.add("POST", "/register", register)

function validateURL(destination: string): boolean {
	let result: boolean
	try {
		const url = new URL(destination)
		result = url.protocol == "https:"
	} catch (e) {
		result = false
	}
	return result
}
