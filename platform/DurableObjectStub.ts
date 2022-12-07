import { DurableObjectId } from "./DurableObjectId"
import { Fetcher } from "./Fetcher"

export interface DurableObjectStub extends Fetcher {
	readonly id: DurableObjectId
	readonly name?: string
}

export namespace DurableObjectStub {
	export function is(value: DurableObjectStub | any): value is DurableObjectStub {
		return (
			typeof value == "object" &&
			(typeof value.name == "string" || value.name == undefined) &&
			DurableObjectId.is(value.id) &&
			typeof value.fetch == "function"
		)
	}
}
