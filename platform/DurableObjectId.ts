export interface DurableObjectId {
	toString(): string
	equals(other: DurableObjectId): boolean
	readonly name?: string
}

export namespace DurableObjectId {
	export function is(value: DurableObjectId | any): value is DurableObjectId {
		return (typeof value.name == "string" || value.name == undefined) && typeof value.toString == "function"
	}
}
