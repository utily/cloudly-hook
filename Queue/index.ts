import { storage } from "cloudly-storage"
import { Types } from "../Types"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {}
	async enqueue(event: Types.EventBase): Promise<void> {
		await this.namespace.open().post<Types.EventBase>("/queue", event)
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export type Storage = QueueStorage
	export const Storage = QueueStorage
}
