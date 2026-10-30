/**
 * Cloudflare Pages Function: GET /api/payment-config
 * Returns public payment configuration for the frontend (publishable key only).
 * Mirrors Open Pay's /api/payment-config endpoint.
 */
import { CORS_HEADERS, json, getFrontendConfig } from './_stripe.js'

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export function onRequestGet({ env }) {
  return json(getFrontendConfig(env))
}
