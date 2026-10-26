/**
 * Cloudflare Pages Function: /api/health
 * Simple healthcheck and diagnostic endpoint.
 */

export async function onRequestGet(context) {
  const { env } = context

  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'nw-siding-api',
      timestamp: new Date().toISOString(),
      configured: {
        resend: Boolean(env && env.RESEND_API_KEY),
        webhook: Boolean(env && env.LEAD_WEBHOOK_URL),
        destinationEmail: (env && env.CONTACT_EMAIL_TO) || 'sidinggurus@northwestsiding.com (default)',
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
