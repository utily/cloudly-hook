import { DurableObjectGetAlarmOptions } from "./DurableObjectGetAlarmOptions"
import { DurableObjectGetOptions } from "./DurableObjectGetOptions"
import { DurableObjectListOptions } from "./DurableObjectListOptions"
import { DurableObjectPutOptions } from "./DurableObjectPutOptions"
import { DurableObjectSetAlarmOptions } from "./DurableObjectSetAlarmOptions"
import { DurableObjectTransaction } from "./DurableObjectTransaction"

export interface DurableObjectStorage {
	get<T = unknown>(key: string, options?: DurableObjectGetOptions): Promise<T | undefined>
	get<T = unknown>(keys: string[], options?: DurableObjectGetOptions): Promise<Map<string, T>>
	list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>
	put<T>(key: string, value: T, options?: DurableObjectPutOptions): Promise<void>
	put<T>(entries: Record<string, T>, options?: DurableObjectPutOptions): Promise<void>
	delete(key: string, options?: DurableObjectPutOptions): Promise<boolean>
	delete(keys: string[], options?: DurableObjectPutOptions): Promise<number>
	deleteAll(options?: DurableObjectPutOptions): Promise<void>
	transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>
	getAlarm(options?: DurableObjectGetAlarmOptions): Promise<number | null>
	setAlarm(scheduledTime: number | Date, options?: DurableObjectSetAlarmOptions): Promise<void>
	deleteAlarm(options?: DurableObjectSetAlarmOptions): Promise<void>
}
