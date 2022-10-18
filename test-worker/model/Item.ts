export interface Item {
	id: string
	number: number
}

export namespace Item {
	export function is(value: any | Item): value is Item {
		return typeof value == "object" && typeof value.id == "string" && typeof value.number == "number"
	}
}
