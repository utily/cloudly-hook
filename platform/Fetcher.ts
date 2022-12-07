type CertVerificationStatus =
	| "SUCCESS"
	| "NONE"
	| "FAILED:self signed certificate"
	| "FAILED:unable to verify the first certificate"
	| "FAILED:certificate is not yet valid"
	| "FAILED:certificate has expired"
	| "FAILED"
interface IncomingRequestCfPropertiesTLSClientAuth {
	certPresented: "1"
	certVerified: Exclude<CertVerificationStatus, "NONE">
	certRevoked: "1" | "0"
	certIssuerDN: string
	certSubjectDN: string
	certIssuerDNRFC2253: string
	certSubjectDNRFC2253: string
	certIssuerDNLegacy: string
	certSubjectDNLegacy: string
	certSerial: string
	certIssuerSerial: string
	certSKI: string
	certIssuerSKI: string
	certFingerprintSHA1: string
	certFingerprintSHA256: string
	certNotBefore: string
	certNotAfter: string
}
interface IncomingRequestCfPropertiesTLSClientAuthPlaceholder {
	certPresented: "0"
	certVerified: "NONE"
	certRevoked: "0"
	certIssuerDN: ""
	certSubjectDN: ""
	certIssuerDNRFC2253: ""
	certSubjectDNRFC2253: ""
	certIssuerDNLegacy: ""
	certSubjectDNLegacy: ""
	certSerial: ""
	certIssuerSerial: ""
	certSKI: ""
	certIssuerSKI: ""
	certFingerprintSHA1: ""
	certFingerprintSHA256: ""
	certNotBefore: ""
	certNotAfter: ""
}
interface IncomingRequestCfPropertiesBotManagementBase {
	score: number
	verifiedBot: boolean
	corporateProxy: boolean
	staticResource: boolean
}
interface IncomingRequestCfPropertiesBotManagement {
	botManagement: IncomingRequestCfPropertiesBotManagementBase
	clientTrustScore: number
}
interface IncomingRequestCfPropertiesBotManagementEnterprise extends IncomingRequestCfPropertiesBotManagement {
	botManagement: IncomingRequestCfPropertiesBotManagementBase & {
		ja3Hash: string
	}
}
interface IncomingRequestCfPropertiesBotManagementEnterprise extends IncomingRequestCfPropertiesBotManagement {
	botManagement: IncomingRequestCfPropertiesBotManagementBase & {
		ja3Hash: string
	}
}
interface IncomingRequestCfPropertiesCloudflareForSaaSEnterprise<HostMetadata> {
	hostMetadata: HostMetadata
}
interface IncomingRequestCfPropertiesCloudflareAccessOrApiShield {
	tlsClientAuth: IncomingRequestCfPropertiesTLSClientAuth | IncomingRequestCfPropertiesTLSClientAuthPlaceholder
}
type IncomingRequestCfPropertiesGeographicInformation =
	| unknown
	| {
			country: "T1"
	  }
	| {
			country: Iso3166Alpha2Code
			isEUCountry?: "1"
			continent: ContinentCode
			city?: string
			postalCode?: string
			latitude?: string
			longitude?: string
			timezone?: string
			region?: string
			regionCode?: string
			metroCode?: string
	  }
type IncomingRequestCfProperties<HostMetadata = unknown> = IncomingRequestCfPropertiesBase &
	IncomingRequestCfPropertiesBotManagementEnterprise &
	IncomingRequestCfPropertiesCloudflareForSaaSEnterprise<HostMetadata> &
	IncomingRequestCfPropertiesGeographicInformation &
	IncomingRequestCfPropertiesCloudflareAccessOrApiShield
type IncomingRequestCfPropertiesEdgeRequestKeepAliveStatus = 0 | 1 | 2 | 3 | 4 | 5
interface RequestInitCfProperties {
	cacheEverything?: boolean
	cacheKey?: string
	cacheTags?: string[]
	cacheTtl?: number
	cacheTtlByStatus?: Record<string, number>
	scrapeShield?: boolean
	apps?: boolean
	image?: RequestInitCfPropertiesImage
	minify?: RequestInitCfPropertiesImageMinify
	mirage?: boolean
	polish?: "lossy" | "lossless" | "off"
	resolveOverride?: string
}
interface IncomingRequestCfPropertiesBase {
	asn: number
	asOrganization: string
	clientAcceptEncoding?: string
	clientTcpRtt?: number
	colo: string
	edgeRequestKeepAliveStatus: IncomingRequestCfPropertiesEdgeRequestKeepAliveStatus
	httpProtocol: string
	requestPriority: string
	tlsVersion: string
	tlsCipher: string
	tlsExportedAuthenticator?: IncomingRequestCfPropertiesExportedAuthenticatorMetadata
}
interface IncomingRequestCfPropertiesExportedAuthenticatorMetadata {
	clientHandshake: string
	serverHandshake: string
	clientFinished: string
	serverFinished: string
}
interface RequestInit<CfType = IncomingRequestCfProperties | RequestInitCfProperties> {
	method?: string
	headers?: HeadersInit
	body?: BodyInit | null
	redirect?: string
	fetcher?: Fetcher | null
	cf?: CfType
	signal?: AbortSignal | null
}

export interface Fetcher {
	fetch(input: RequestInfo, init?: RequestInit<RequestInitCfProperties>): Promise<Response>
	connect(address: string, options?: SocketOptions): Socket
}
interface FetcherPutOptions {
	expiration?: number
	expirationTtl?: number
}
interface SocketOptions {
	tsl: boolean
}
interface Socket {
	readonly readable: ReadableStream
	readonly writable: WritableStream
	readonly closed: Promise<void>
	close(): Promise<void>
}
interface RequestInitCfPropertiesImage extends BasicImageTransformations {
	dpr?: number
	trim?: {
		left?: number
		top?: number
		right?: number
		bottom?: number
	}
	quality?: number
	format?: "avif" | "webp" | "json" | "jpeg" | "png"
	anim?: boolean
	metadata?: "keep" | "copyright" | "none"
	sharpen?: number
	blur?: number
	draw?: RequestInitCfPropertiesImageDraw[]
	"origin-auth"?: "share-publicly"
}
interface RequestInitCfPropertiesImageMinify {
	javascript?: boolean
	css?: boolean
	html?: boolean
}
interface BasicImageTransformations {
	width?: number
	height?: number
	fit?: "scale-down" | "contain" | "cover" | "crop" | "pad"
	gravity?: "left" | "right" | "top" | "bottom" | "center" | "auto" | BasicImageTransformationsGravityCoordinates
	background?: string
	rotate?: 0 | 90 | 180 | 270 | 360
}
interface BasicImageTransformationsGravityCoordinates {
	x: number
	y: number
}
interface RequestInitCfPropertiesImageDraw extends BasicImageTransformations {
	url: string
	opacity?: number
	repeat?: true | "x" | "y"
	top?: number
	left?: number
	bottom?: number
	right?: number
}
type Iso3166Alpha2Code =
	| "AD"
	| "AE"
	| "AF"
	| "AG"
	| "AI"
	| "AL"
	| "AM"
	| "AO"
	| "AQ"
	| "AR"
	| "AS"
	| "AT"
	| "AU"
	| "AW"
	| "AX"
	| "AZ"
	| "BA"
	| "BB"
	| "BD"
	| "BE"
	| "BF"
	| "BG"
	| "BH"
	| "BI"
	| "BJ"
	| "BL"
	| "BM"
	| "BN"
	| "BO"
	| "BQ"
	| "BR"
	| "BS"
	| "BT"
	| "BV"
	| "BW"
	| "BY"
	| "BZ"
	| "CA"
	| "CC"
	| "CD"
	| "CF"
	| "CG"
	| "CH"
	| "CI"
	| "CK"
	| "CL"
	| "CM"
	| "CN"
	| "CO"
	| "CR"
	| "CU"
	| "CV"
	| "CW"
	| "CX"
	| "CY"
	| "CZ"
	| "DE"
	| "DJ"
	| "DK"
	| "DM"
	| "DO"
	| "DZ"
	| "EC"
	| "EE"
	| "EG"
	| "EH"
	| "ER"
	| "ES"
	| "ET"
	| "FI"
	| "FJ"
	| "FK"
	| "FM"
	| "FO"
	| "FR"
	| "GA"
	| "GB"
	| "GD"
	| "GE"
	| "GF"
	| "GG"
	| "GH"
	| "GI"
	| "GL"
	| "GM"
	| "GN"
	| "GP"
	| "GQ"
	| "GR"
	| "GS"
	| "GT"
	| "GU"
	| "GW"
	| "GY"
	| "HK"
	| "HM"
	| "HN"
	| "HR"
	| "HT"
	| "HU"
	| "ID"
	| "IE"
	| "IL"
	| "IM"
	| "IN"
	| "IO"
	| "IQ"
	| "IR"
	| "IS"
	| "IT"
	| "JE"
	| "JM"
	| "JO"
	| "JP"
	| "KE"
	| "KG"
	| "KH"
	| "KI"
	| "KM"
	| "KN"
	| "KP"
	| "KR"
	| "KW"
	| "KY"
	| "KZ"
	| "LA"
	| "LB"
	| "LC"
	| "LI"
	| "LK"
	| "LR"
	| "LS"
	| "LT"
	| "LU"
	| "LV"
	| "LY"
	| "MA"
	| "MC"
	| "MD"
	| "ME"
	| "MF"
	| "MG"
	| "MH"
	| "MK"
	| "ML"
	| "MM"
	| "MN"
	| "MO"
	| "MP"
	| "MQ"
	| "MR"
	| "MS"
	| "MT"
	| "MU"
	| "MV"
	| "MW"
	| "MX"
	| "MY"
	| "MZ"
	| "NA"
	| "NC"
	| "NE"
	| "NF"
	| "NG"
	| "NI"
	| "NL"
	| "NO"
	| "NP"
	| "NR"
	| "NU"
	| "NZ"
	| "OM"
	| "PA"
	| "PE"
	| "PF"
	| "PG"
	| "PH"
	| "PK"
	| "PL"
	| "PM"
	| "PN"
	| "PR"
	| "PS"
	| "PT"
	| "PW"
	| "PY"
	| "QA"
	| "RE"
	| "RO"
	| "RS"
	| "RU"
	| "RW"
	| "SA"
	| "SB"
	| "SC"
	| "SD"
	| "SE"
	| "SG"
	| "SH"
	| "SI"
	| "SJ"
	| "SK"
	| "SL"
	| "SM"
	| "SN"
	| "SO"
	| "SR"
	| "SS"
	| "ST"
	| "SV"
	| "SX"
	| "SY"
	| "SZ"
	| "TC"
	| "TD"
	| "TF"
	| "TG"
	| "TH"
	| "TJ"
	| "TK"
	| "TL"
	| "TM"
	| "TN"
	| "TO"
	| "TR"
	| "TT"
	| "TV"
	| "TW"
	| "TZ"
	| "UA"
	| "UG"
	| "UM"
	| "US"
	| "UY"
	| "UZ"
	| "VA"
	| "VC"
	| "VE"
	| "VG"
	| "VI"
	| "VN"
	| "VU"
	| "WF"
	| "WS"
	| "YE"
	| "YT"
	| "ZA"
	| "ZM"
	| "ZW"
type ContinentCode = "AF" | "AN" | "AS" | "EU" | "NA" | "OC" | "SA"
