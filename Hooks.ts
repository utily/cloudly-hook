import { http } from "cloudly-http"
import { storage } from "cloudly-storage"
import { Queue } from "./Queue"
import { Types } from "./Types"

export class Hooks<T extends string> {
	#options: Hooks.Options = Types.EventBase.defaultOptions
	private constructor(
		readonly queue: Queue,
		readonly registrations?: storage.KeyValueStore<{ url: string; header?: http.Request.Header }>,
		options?: Partial<Hooks.Options>
	) {
		options && this.configure(options)
	}
	async register(listener: Hooks.Registration<T>): Promise<boolean> {
		return (
			// TODO: make key unique
			this.registrations
				?.set(`${listener.hook}|${new URL(listener.url).hostname}`, {
					url: listener.url,
					header: listener.header,
				})
				.then(
					() => true,
					() => false
				) ?? false
		)
	}
	configure(options: Partial<Hooks.Options>): Hooks<T> {
		options.maxRetries && (this.#options.maxRetries = options.maxRetries)
		options.timeFactor && (this.#options.timeFactor = options.timeFactor)
		return this
	}
	async trigger(hook: T, body: any, destinations?: string[]): Promise<void> {
		const options = this.#options
		const events: Hooks.Event<T>[] = []
		if (destinations)
			events.push(...destinations.map(d => ({ hook, url: d, body, options, retries: 0, index: 0 })))
		else {
			events.push(
				...((await this.registrations?.list())?.flatMap(r =>
					r.key.split("|")[0] == hook && r.value ? [{ ...r.value, body, hook, options, retries: 0, index: 0 }] : []
				) ?? [])
			)
		}
		events.length > 0 && (await this.queue.enqueue(events))
	}
	static open<T extends string>(
		queueStorage: storage.DurableObject.Namespace,
		hookStorage?: storage.KeyValueStore,
		options?: Partial<Hooks.Options>
	): Hooks<T> {
		return new Hooks<T>(Queue.open(queueStorage), hookStorage, options)
	}
}

export namespace Hooks {
	export const Storage = Queue.Storage
	export type Registration<T extends string> = Types.Registration<T>
	export const Registration = Types.Registration
	export type Event<T extends string> = Types.EventBase<T>
	export const Event = Types.EventBase
	export type Options = Types.EventBase.Options
}
