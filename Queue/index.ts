import { Identifier } from "cryptly"
import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	#client: storage.DurableObject.Client | undefined // TODO FIX NOW NILS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {}
	async enqueue(request: http.Request.Like): Promise<void> {
		this.#client = this.namespace.open(Identifier.generate(16)) //FIXME
		await this.#client.post<Record<string, any>>("/queue", request)
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export const Storage = QueueStorage
}
