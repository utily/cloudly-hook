export interface Item {
	hook: string
	value: any
}

export namespace Item {
	export function is(value: Item | any): value is Item {
		return typeof value == "object" && typeof value.hook == "string"
	}
}
