import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as platform from "./platform"
import { Queue } from "./Queue"

export class Hooks<T extends Record<string, http.Request>> {
	destination: string | Partial<Record<keyof T, string>>
	private constructor(readonly queue: Queue, destination: string | Partial<Record<keyof T, string>>) {
		this.destination = destination
	}
	async trigger<H extends keyof T>(hook: H, value: T[H]): Promise<void> {
		const url = typeof this.destination == "string" ? this.destination : this.destination[hook]
		if (url) {
			const request = http.Request.create({
				header: Object.fromEntries(Object.entries(value.header).filter(([header, _]) => header != "contentLength")),
				method: "POST",
				body: await value.body,
				url: url,
			})
			this.queue.enqueue(hook as string, request)
		}
	}
	static open<T extends Record<string, any>>(
		queueStorage: platform.DurableObjectNamespace | undefined,
		destination: string | Partial<Record<keyof T, string>>
	): Hooks<T> | undefined {
		const namespace = storage.DurableObject.Namespace.open(queueStorage)
		return namespace && new Hooks(Queue.open(namespace), destination)
	}
	setDestination(destination: string | Partial<Record<keyof T, string>>) {
		this.destination = destination
	}
}
