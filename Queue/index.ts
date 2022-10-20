import * as storage from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	#client: storage.DurableObject.Client
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {
		// this.client.onError = async (request, response) => {
		// 	console.log("error", request, response)
		// 	return false
		// }
	}
	async enqueue(hook: string, value: any): Promise<void> {
		this.#client = this.namespace.open(hook)
		this.#client.post<Record<string, any>>("/queue", { hook, value })
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export const Storage = QueueStorage
}
