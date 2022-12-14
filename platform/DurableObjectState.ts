import { DurableObjectId } from "./DurableObjectId"
import { DurableObjectStorage } from "./DurableObjectStorage"

export interface DurableObjectState {
	waitUntil(promise: void | Promise<void>): void
	readonly id: DurableObjectId
	readonly storage: DurableObjectStorage
	blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>
}
