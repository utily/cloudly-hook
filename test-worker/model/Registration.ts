export interface Registration {
	hook: "item-create" | "item-change" | "item-fetch" | "item-remove" | "item-replace" | "item-list"
	destination: string
	id: string
}

export namespace Registration {
	export function is(value: Registration | any): value is Registration {
		return (
			typeof value == "object" &&
			typeof value.id == "string" &&
			typeof value.destination == "string" &&
			typeof value.hook == "string" &&
			(value.hook == "item-create" ||
				value.hook == "item-change" ||
				value.hook == "item-fetch" ||
				value.hook == "item-remove" ||
				// value.hook == "item-list" ||
				value.hook == "item-replace")
		)
	}
}
