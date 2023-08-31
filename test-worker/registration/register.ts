import * as gracely from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function register(request: http.Request, context: Context): Promise<model.Registration | gracely.Error> {
	let result: model.Registration | gracely.Error
	const registration = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Registration.is(registration) || !validateURL(registration.destination))
		result = gracely.client.invalidContent("Registration", "Body is not a valid registration.")
	else {
		result = await context.listen(registration)
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
