import * as storage from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	private constructor(private readonly client: storage.DurableObject.Client) {
		this.client.onError = async (request, response) => {
			console.log("error", request, response)
			return false
		}
	}
	async enqueue(hook: string, value: any): Promise<void> {
		this.client.post<Record<string, any>>("/queue", { hook, value })
	}
	static open(client: storage.DurableObject.Client): Queue {
		return new Queue(client)
	}
}

export namespace Queue {
	export const Storage = QueueStorage
}
