import * as cryptly from "cryptly"
import * as storage from "cloudly-storage"
import * as platform from "./platform"
import { Queue } from "./Queue"

export class Hooks<T extends Record<string, any>> {
	private constructor(readonly queue: Queue) {}
	trigger<H extends keyof T>(hook: H, value: T[H]): void {
		this.queue.enqueue(hook as string, value)
		console.log(hook, value)
	}
	static open<T extends Record<string, any>>(
		queueStorage: platform.DurableObjectNamespace | undefined
	): Hooks<T> | undefined {
		const namespace = storage.DurableObject.Namespace.open(queueStorage)
		return namespace && new Hooks(Queue.open(namespace.open("test")))
	}
}
