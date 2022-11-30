import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as platform from "./platform"
import { Queue } from "./Queue"

export class Hooks {
	private constructor(readonly queue: Queue, readonly registrations: storage.KeyValueStore<string>) {}
	async trigger(hook: string, value: any): Promise<void> {
		const url = await this.registrations.get(hook)
		if (url) {
			const request = http.Request.create({
				method: "POST",
				body: value,
				url: url.value,
			})
			this.queue.enqueue(hook, request)
		}
	}
	static open(
		queueStorage: platform.DurableObjectNamespace | undefined,
		registrationStorage: platform.KVNamespace | undefined
	): Hooks | undefined {
		const queueNamespace = storage.DurableObject.Namespace.open(queueStorage)
		const registrations = registrationStorage
			? storage.KeyValueStore.partition(storage.KeyValueStore.Json.create(registrationStorage), "hook/")
			: undefined
		return queueNamespace && registrations && new Hooks(Queue.open(queueNamespace), registrations)
	}
	async register(hook: string, destination: string, update = false): Promise<gracely.Result> {
		let result: gracely.Result
		if (!this.validateUrl(destination))
			result = gracely.client.invalidContent("url", "Invalid url or illegal protocol (should use 'https:').")
		else if (!update && (await this.registrations.get(hook)))
			result = gracely.client.invalidContent(
				"registration",
				`Url already registered for hook '${hook}'. Did you mean to update?`
			)
		else {
			await this.registrations.set(hook, destination)
			result = gracely.success.created({ hook: hook, url: destination })
		}
		return result
	}
	private validateUrl(destination: string): boolean {
		let url: URL
		let result: boolean
		try {
			url = new URL(destination)
			result = url.protocol === "https:"
		} catch (e) {
			result = false
		}
		return result
	}
}
