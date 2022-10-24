import { Identifier } from "cryptly"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	#client: storage.DurableObject.Client
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {}
	async enqueue(hook: string, value: http.Request): Promise<void> {
		this.#client = this.namespace.open(Identifier.generate(16))
		await this.#client.post<Record<string, any>>("/queue", { hook, value })
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export const Storage = QueueStorage
}
