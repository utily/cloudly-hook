import { KVNamespaceListKey } from "./KVNamespaceListKey"

export interface KVNamespaceListResult<Metadata> {
	keys: KVNamespaceListKey<Metadata>[]
	list_complete: boolean
	cursor?: string
}
