import { DurableObjectId } from "./DurableObjectId"

export interface DurableObjectStub {
	name?: string
	id: DurableObjectId
	fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
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
