import { definePluginEntry } from "openclaw/plugin-sdk/core";
//#region node_modules/typebox/build/system/memory/metrics.mjs
/** TypeBox instantiation metrics */
const Metrics = {
	assign: 0,
	create: 0,
	clone: 0,
	discard: 0,
	update: 0
};
//#endregion
//#region node_modules/typebox/build/guard/guard.mjs
/** Returns true if this value is null */
function IsNull(value) {
	return IsEqual(value, null);
}
/** Returns true if this value is an object */
function IsObject(value) {
	return IsEqual(typeof value, "object") && !IsNull(value);
}
function IsEqual(left, right) {
	return left === right;
}
/** Returns true if the PropertyKey is Unsafe (ref: prototype-pollution). */
function IsUnsafePropertyKey(key) {
	return IsEqual(key, "__proto__") || IsEqual(key, "constructor") || IsEqual(key, "prototype");
}
/** Returns true if this value has this property key */
function HasPropertyKey(value, key) {
	return IsUnsafePropertyKey(key) ? Object.prototype.hasOwnProperty.call(value, key) : key in value;
}
/** Returns property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
function Keys(value) {
	return Object.getOwnPropertyNames(value);
}
//#endregion
//#region node_modules/typebox/build/system/settings/settings.mjs
const settings = {
	immutableTypes: false,
	maxErrors: 8,
	useAcceleration: true,
	exactOptionalPropertyTypes: false,
	enumerableKind: false,
	correctiveParse: false
};
/** Gets current system settings */
function Get() {
	return settings;
}
//#endregion
//#region node_modules/typebox/build/system/memory/create.mjs
function MergeHidden(left, right) {
	for (const key of Object.keys(right)) Object.defineProperty(left, key, {
		configurable: true,
		writable: true,
		enumerable: false,
		value: right[key]
	});
	return left;
}
function Merge(left, right) {
	return {
		...left,
		...right
	};
}
/**
* Creates an object with hidden, enumerable, and optional property sets. This function
* ensures types are instantiated according to configuration rules for enumerable and
* non-enumerable properties.
*/
function Create(hidden, enumerable, options = {}) {
	Metrics.create += 1;
	const settings = Get();
	const withOptions = Merge(enumerable, options);
	const withHidden = settings.enumerableKind ? Merge(withOptions, hidden) : MergeHidden(withOptions, hidden);
	return settings.immutableTypes ? Object.freeze(withHidden) : withHidden;
}
//#endregion
//#region node_modules/typebox/build/type/types/schema.mjs
function IsSchema(value) {
	return IsObject(value);
}
//#endregion
//#region node_modules/typebox/build/type/types/_optional.mjs
/** Returns true if the given value is TOptional */
function IsOptional(value) {
	return IsSchema(value) && HasPropertyKey(value, "~optional");
}
//#endregion
//#region node_modules/typebox/build/type/types/properties.mjs
/** Creates a RequiredArray derived from the given TProperties value. */
function RequiredArray(properties) {
	return Keys(properties).filter((key) => !IsOptional(properties[key]));
}
//#endregion
//#region node_modules/typebox/build/type/types/object.mjs
/** Creates an Object type. */
function _Object_(properties, options = {}) {
	const requiredKeys = RequiredArray(properties);
	return Create({ "~kind": "Object" }, {
		type: "object",
		...requiredKeys.length > 0 ? { required: requiredKeys } : {},
		properties
	}, options);
}
//#endregion
//#region node_modules/typebox/build/system/hashing/hash.mjs
var ByteMarker;
(function(ByteMarker) {
	ByteMarker[ByteMarker["Array"] = 0] = "Array";
	ByteMarker[ByteMarker["BigInt"] = 1] = "BigInt";
	ByteMarker[ByteMarker["Boolean"] = 2] = "Boolean";
	ByteMarker[ByteMarker["Date"] = 3] = "Date";
	ByteMarker[ByteMarker["Constructor"] = 4] = "Constructor";
	ByteMarker[ByteMarker["Function"] = 5] = "Function";
	ByteMarker[ByteMarker["Null"] = 6] = "Null";
	ByteMarker[ByteMarker["Number"] = 7] = "Number";
	ByteMarker[ByteMarker["Object"] = 8] = "Object";
	ByteMarker[ByteMarker["RegExp"] = 9] = "RegExp";
	ByteMarker[ByteMarker["String"] = 10] = "String";
	ByteMarker[ByteMarker["Symbol"] = 11] = "Symbol";
	ByteMarker[ByteMarker["TypeArray"] = 12] = "TypeArray";
	ByteMarker[ByteMarker["Undefined"] = 13] = "Undefined";
})(ByteMarker || (ByteMarker = {}));
Array.from({ length: 256 }).map((_, i) => BigInt(i));
const F64 = new Float64Array(1);
new DataView(F64.buffer);
new Uint8Array(F64.buffer);
new TextEncoder();
//#endregion
//#region node_modules/typebox/build/type/types/integer.mjs
const IntegerPattern = "-?(?:0|[1-9][0-9]*)";
//#endregion
//#region node_modules/typebox/build/type/types/number.mjs
const NumberPattern = "-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?";
/** Creates a Number type. */
function Number$1(options) {
	return Create({ "~kind": "Number" }, { type: "number" }, options);
}
//#endregion
//#region node_modules/typebox/build/type/types/string.mjs
/** Creates a String type. */
function String$1(options) {
	return Create({ "~kind": "String" }, { type: "string" }, options);
}
//#endregion
//#region node_modules/typebox/build/type/types/record.mjs
const IntegerKey = `^${IntegerPattern}$`;
`${NumberPattern}`;
//#endregion
//#region node_modules/typebox/build/type/script/token/internal/char.mjs
function Range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
}
const Alpha = [...Range(97, 122), ...Range(65, 90)];
const Digit = ["0", ...Range(49, 57)];
[...Digit];
[...[
	...Alpha,
	"_",
	"$"
], ...Digit];
[...Digit];
new RegExp(IntegerKey);
//#endregion
//#region index.ts
const DokuPaymentParamsSchema = _Object_({
	nama_klien: String$1({ description: "Nama lengkap klien yang akan ditagih" }),
	item_deskripsi: String$1({ description: "Deskripsi item atau jasa yang ditagihkan" }),
	nominal_rupiah: Number$1({ description: "Jumlah tagihan dalam Rupiah (contoh: 1500000 untuk 1.5 juta)" })
});
function textResult(text, details) {
	return {
		content: [{
			type: "text",
			text
		}],
		details
	};
}
var doku_payment_default = definePluginEntry({
	id: "doku-payment",
	name: "Doku Payment Gateway",
	description: "Membuat payment link Doku Sandbox untuk penagihan klien via AI agent",
	register(api) {
		api.registerTool({
			name: "doku_create_payment_link",
			label: "Doku: Buat Payment Link",
			description: "Gunakan tool ini untuk membuat payment link Doku ketika user meminta untuk menagih seseorang. Ekstrak nama_klien, item_deskripsi, dan nominal_rupiah dari permintaan user.",
			parameters: DokuPaymentParamsSchema,
			async execute(_toolCallId, rawParams) {
				const params = rawParams;
				const clientId = process.env.DOKU_CLIENT_ID ?? "";
				const secretKey = process.env.DOKU_SECRET_KEY ?? "";
				const baseUrl = process.env.DOKU_BASE_URL ?? "https://api-sandbox.doku.com";
				if (!clientId || !secretKey) return textResult("ERROR: DOKU_CLIENT_ID atau DOKU_SECRET_KEY belum dikonfigurasi di environment variables.", {
					status: "failed",
					error: "missing_credentials"
				});
				const invoiceNumber = "INV-" + Math.random().toString(36).substring(2, 10).toUpperCase();
				const requestId = crypto.randomUUID();
				const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z");
				const body = {
					order: {
						amount: params.nominal_rupiah,
						invoice_number: invoiceNumber,
						currency: "IDR",
						session_id: crypto.randomUUID()
					},
					payment: { payment_due_date: 60 },
					customer: {
						name: params.nama_klien,
						email: "billing@paygent.ai"
					},
					line_items: [{
						id: "ITEM-001",
						name: params.item_deskripsi,
						price: params.nominal_rupiah,
						quantity: 1
					}]
				};
				const headers = {
					"Client-Id": clientId,
					"Request-Id": requestId,
					"Request-Timestamp": timestamp,
					Signature: `HMACSHA256=${secretKey}`,
					"Content-Type": "application/json"
				};
				try {
					const response = await fetch(`${baseUrl}/checkout/v1/payment`, {
						method: "POST",
						headers,
						body: JSON.stringify(body),
						signal: AbortSignal.timeout(3e4)
					});
					if (!response.ok) {
						const errorText = await response.text();
						return textResult(`ERROR: Doku API mengembalikan status ${response.status}. Detail: ${errorText}`, {
							status: "failed",
							error: `http_${response.status}`
						});
					}
					const paymentUrl = (await response.json())?.response?.payment?.url;
					if (!paymentUrl) return textResult("ERROR: Struktur response Doku tidak dikenal. Field response.payment.url tidak ditemukan.", {
						status: "failed",
						error: "unexpected_response_shape"
					});
					const successPayload = {
						success: true,
						payment_url: paymentUrl,
						invoice_number: invoiceNumber,
						nama_klien: params.nama_klien,
						item_deskripsi: params.item_deskripsi,
						nominal_rupiah: params.nominal_rupiah
					};
					return textResult(JSON.stringify(successPayload), {
						status: "success",
						payment_url: paymentUrl,
						invoice_number: invoiceNumber,
						nama_klien: params.nama_klien,
						item_deskripsi: params.item_deskripsi,
						nominal_rupiah: params.nominal_rupiah
					});
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					return textResult(`ERROR: Gagal terhubung ke Doku API. Detail: ${message}`, {
						status: "failed",
						error: message
					});
				}
			}
		});
	}
});
//#endregion
export { doku_payment_default as default };
