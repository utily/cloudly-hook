import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as platform from "./platform"
import { Queue } from "./Queue"

export class Hooks<T extends Record<string, any>> {
	destination?: string | Partial<Record<keyof T, string>>
	private constructor(readonly queue: Queue) {}
	trigger<H extends keyof T>(hook: H, value: T[H]): void {
		const request = http.Request.create({
			// header: value.header,
			// body: value.body,
			url: "https://ptsv2.com/t/42xbq-1666270086/post",
		})
		// value.url =
		// 	value.url ??
		// 	(this.destination ? (typeof this.destination == "string" ? this.destination : this.destination[hook]) : undefined)
		// if (value.url)
		this.queue.enqueue(hook as string, request)
		console.log(hook, value)
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
