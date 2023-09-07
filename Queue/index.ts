import { storage } from "cloudly-storage"
import { Types } from "../Types"
import { Storage as QueueStorage } from "./Storage"

export class Queue {
	private constructor(private readonly namespace: storage.DurableObject.Namespace) {}
	async enqueue(events: Types.EventBase[]): Promise<void> {
		const shards = Math.ceil(events.length / 500)
		const shardedEvents: Types.EventBase[][] = []
		for (let i = 0; i < shards; i++)
			shardedEvents.push(events.slice(i * shards, (i + 1) * shards))
		await Promise.all(
			shardedEvents.map(async eventShard => await this.namespace.open().post<Types.EventBase[]>("/queue", eventShard))
		)
	}
	static open(namespace: storage.DurableObject.Namespace): Queue {
		return new Queue(namespace)
	}
}

export namespace Queue {
	export type Storage = QueueStorage
	export const Storage = QueueStorage
}
