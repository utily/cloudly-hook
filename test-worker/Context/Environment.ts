export interface Environment extends Record<string, undefined | string | DurableObjectNamespace | KVNamespace> {
	adminSecret?: string
	hookNamespace?: DurableObjectNamespace
	destinationNamespace?: KVNamespace
}
