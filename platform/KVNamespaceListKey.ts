export interface KVNamespaceListKey<Metadata> {
	name: string
	expiration?: number
	metadata?: Metadata
}
