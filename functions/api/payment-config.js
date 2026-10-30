// GET /api/payment-config — public payment config for /pay and /pos (publishable key only).
import { json } from '../_lib/util.js'
import { frontendConfig } from '../_lib/stripe.js'

export function onRequestGet({ env }) {
  return json(frontendConfig(env))
}
