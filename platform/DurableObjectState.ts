import { DurableObjectId } from "./DurableObjectId"
import { DurableObjectStorage } from "./DurableObjectStorage"

export interface DurableObjectState {
	waitUntil(promise: Promise<any>): void
	readonly id: DurableObjectId | string
	readonly storage: DurableObjectStorage
	blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>
}
