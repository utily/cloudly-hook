import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as platform from "./platform"
import { Queue } from "./Queue"

export class Hooks<T extends Record<string, http.Request>> {
	destination?: string | Partial<Record<keyof T, string>>
	private constructor(readonly queue: Queue) {}
	async trigger<H extends keyof T>(hook: H, value: T[H]): Promise<void> {
		const request = http.Request.create({
			header: value.header,
			method: "POST",
			body: await value.body,
			url: "https://ptsv2.com/t/42xbq-1666270086/post",
		})
		// value.url =
		// 	value.url ??
		// 	(this.destination ? (typeof this.destination == "string" ? this.destination : this.destination[hook]) : undefined)
		// if (value.url)
		console.log("Hooks.ts", hook, value)
		this.queue.enqueue(hook as string, request)
	}
	static open<T extends Record<string, any>>(
		queueStorage: platform.DurableObjectNamespace | undefined
	): Hooks<T> | undefined {
		const namespace = storage.DurableObject.Namespace.open(queueStorage)
		return namespace && new Hooks(Queue.open(namespace))
	}
	setDestination(destination: string | Partial<Record<keyof T, string>>) {
		this.destination = destination
	}
}
