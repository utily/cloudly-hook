import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	#client: storage.DurableObject.Client
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {
		this.#client = this.namespace.open()
	}
	async enqueue(request: http.Request.Like): Promise<void> {
		await this.#client.post<Record<string, any>>("/queue", request)
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export type Storage = QueueStorage
	export const Storage = QueueStorage
}
