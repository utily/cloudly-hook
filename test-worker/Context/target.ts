import * as gracely from "gracely"
import * as model from "../model"

export function itemCallback(item: model.Item): model.Item | gracely.Error {
	console.log("callback")
	return item ? item : gracely.client.notFound("callback not working")
}
