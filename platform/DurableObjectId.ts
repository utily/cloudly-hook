export interface DurableObjectId {
	name?: string
	toString: () => string
}

export namespace DurableObjectId {
	export function is(value: DurableObjectId | any): value is DurableObjectId {
		return (typeof value.name == "string" || value.name == undefined) && typeof value.toString == "function"
	}
}
