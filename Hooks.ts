import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Queue } from "./Queue"

export class Hooks {
	private constructor(readonly queue: Queue) {}
	async trigger(target: string, value: any): Promise<void> {
		let request: http.Request
		if (!http.Request.is(value)) {
			request = http.Request.create({
				header: {
					contentType: "application/json",
				},
				method: "POST",
				body: value,
				url: target,
			})
		} else {
			request = value
		}
		this.queue.enqueue(request)
	}
	static open(queueStorage: DurableObjectNamespace | undefined): Hooks | undefined {
		const queueNamespace = storage.DurableObject.Namespace.open(queueStorage)
		return queueNamespace && new Hooks(Queue.open(queueNamespace))
	}
}
