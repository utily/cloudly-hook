export interface DurableObjectListOptions {
	start?: string
	startAfter?: string
	end?: string
	prefix?: string
	reverse?: boolean
	limit?: number
	allowConcurrency?: boolean
	noCache?: boolean
}
