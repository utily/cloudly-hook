import * as cloudflare from "@cloudflare/workers-types"

export interface Environment
	extends Record<string, undefined | string | cloudflare.DurableObjectNamespace | cloudflare.KVNamespace> {
	adminSecret?: string
	hookNamespace?: cloudflare.DurableObjectNamespace
	destinationNamespace?: cloudflare.KVNamespace
}
