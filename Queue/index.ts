import * as storage from "cloudly-storage"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	constructor(private readonly client: storage.DurableObject.Client) {
		this.client.onError = async (request, response) => {
			console.log("error", request, response)
			return false
		}
	}
	async enqueue(hook: string, value: any): Promise<void> {
		this.client.post<Record<string, any>>("/queue", { hook, value })
	}
}

export namespace Queue {
	export const Storage = QueueStorage
}
