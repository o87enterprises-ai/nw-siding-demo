/**
 * Cloudflare Pages Function: /api/contact
 * Handles estimate request submissions from the website contact form.
 * 
 * Supports:
 * - Spam protection via honeypot
 * - Instant contractor notification email via Resend API
 * - Auto-responder confirmation email to the homeowner via Resend API
 * - Optional CRM/SMS dispatch via LEAD_WEBHOOK_URL (Zapier, Make, HighLevel, Slack)
 * - Safe fallback/dev mode if RESEND_API_KEY is not yet configured
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const data = await request.json()
    const {
      firstName = '',
      lastName = '',
      phone = '',
      email = '',
      zip = '',
      service = 'Fiber Cement Siding',
      message = '',
      hp_website = '', // honeypot
    } = data

    // 1. Honeypot check: If bot filled out the hidden field, silently return success
    if (hp_website && hp_website.trim().length > 0) {
      console.warn('Bot submission blocked via honeypot field:', hp_website)
      return new Response(
        JSON.stringify({ success: true, message: 'Request processed' }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Validation
    if (!firstName.trim() || !lastName.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'First and last name are required.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    if (!phone.trim() && !email.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide at least a phone number or email address.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    const leadInfo = {
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      zip: zip.trim(),
      service,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      clientIp: request.headers.get('cf-connecting-ip') || 'Unknown',
      country: request.headers.get('cf-ipcountry') || 'US',
    }

    console.log('📬 New Estimate Request received:', JSON.stringify(leadInfo))

    // 3. Optional Webhook Dispatch (CRM, Zapier, Make, Slack, HighLevel, etc.)
    if (env && env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(env.LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_estimate_lead',
            source: 'northwestsiding.com',
            lead: leadInfo,
          }),
        })
      } catch (webhookErr) {
        console.error('Error forwarding lead to webhook:', webhookErr)
      }
    }

    // 4. Email Dispatch via Resend API
    const resendApiKey = env && env.RESEND_API_KEY
    const toEmail = (env && env.CONTACT_EMAIL_TO) || 'sidinggurus@northwestsiding.com'
    const fromEmail = (env && env.CONTACT_EMAIL_FROM) || 'Northwest Siding <leads@northwestsiding.com>'

    if (resendApiKey) {
      // 4a. Contractor Notification Email
      const contractorHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080C14; color: #EDE9E2; margin: 0; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #0D1220; border: 1px solid #C9A96E; border-radius: 6px; padding: 32px;">
            <div style="border-bottom: 1px solid #1A2236; padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; font-weight: 600;">Northwest Siding Contractors</span>
              <h1 style="font-size: 24px; margin: 8px 0 0; color: #EDE9E2;">New Website Estimate Request</h1>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; width: 140px; text-transform: uppercase; letter-spacing: 0.1em;">Customer</td>
                <td style="padding: 10px 0; color: #EDE9E2; font-size: 16px; font-weight: 600;">${leadInfo.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Service Needed</td>
                <td style="padding: 10px 0; color: #C9A96E; font-size: 16px; font-weight: 600;">${leadInfo.service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td>
                <td style="padding: 10px 0; font-size: 15px;"><a href="tel:${leadInfo.phone}" style="color: #DFC08A; text-decoration: none; font-weight: 600;">${leadInfo.phone || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                <td style="padding: 10px 0; font-size: 15px;"><a href="mailto:${leadInfo.email}" style="color: #DFC08A; text-decoration: none;">${leadInfo.email || 'Not provided'}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">ZIP Code</td>
                <td style="padding: 10px 0; color: #EDE9E2; font-size: 15px;">${leadInfo.zip || 'Not provided'}</td>
              </tr>
              ${leadInfo.message ? `
              <tr>
                <td style="padding: 10px 0; color: #6B7A96; font-size: 13px; vertical-align: top; text-transform: uppercase; letter-spacing: 0.1em;">Project Notes</td>
                <td style="padding: 10px 0; color: #EDE9E2; font-size: 14px; line-height: 1.6; background: #121829; padding: 12px; border-radius: 4px;">${leadInfo.message}</td>
              </tr>` : ''}
            </table>

            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1A2236; font-size: 11px; color: #6B7A96; display: flex; justify-content: space-between;">
              <span>Submitted: ${leadInfo.submittedAt}</span>
              <span>CCB #136733</span>
            </div>
          </div>
        </body>
        </html>
      `

      const contractorRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: leadInfo.email || undefined,
          subject: `Estimate Request: ${leadInfo.fullName} — ${leadInfo.service}`,
          html: contractorHtml,
        }),
      })

      if (!contractorRes.ok) {
        const errorText = await contractorRes.text()
        console.error('Resend contractor notification error:', errorText)
      }

      // 4b. Customer Confirmation Auto-responder (if customer provided email)
      if (leadInfo.email) {
        const customerHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080C14; color: #EDE9E2; margin: 0; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background: #0D1220; border: 1px solid #1A2236; border-radius: 6px; padding: 32px;">
              <div style="border-bottom: 1px solid #1A2236; padding-bottom: 20px; margin-bottom: 24px;">
                <span style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A96E; font-weight: 600;">Northwest Siding Contractors</span>
                <h1 style="font-size: 22px; margin: 8px 0 0; color: #EDE9E2;">We've Received Your Estimate Request</h1>
              </div>

              <p style="font-size: 15px; line-height: 1.7; color: #EDE9E2;">
                Hi ${leadInfo.firstName},
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #6B7A96;">
                Thank you for reaching out to Northwest Siding! We have received your request regarding <strong style="color: #C9A96E;">${leadInfo.service}</strong>.
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #6B7A96;">
                Gary and our Eugene-Springfield exterior specialists will review your project details and reach out to you within one business day with next steps and pricing.
              </p>

              <div style="margin: 28px 0; padding: 18px; background: #121829; border-left: 3px solid #C9A96E; border-radius: 2px;">
                <div style="font-size: 13px; font-weight: 600; color: #EDE9E2; margin-bottom: 4px;">Need to speak with us right away?</div>
                <div style="font-size: 13px; color: #6B7A96;">Feel free to call our office directly at <a href="tel:5416882997" style="color: #DFC08A; text-decoration: none; font-weight: 600;">(541) 688-2997</a>.</div>
              </div>

              <p style="font-size: 13px; color: #6B7A96; line-height: 1.6;">
                Warm regards,<br />
                <strong style="color: #EDE9E2;">Northwest Siding Contractors of Eugene, Inc.</strong><br />
                Eugene's Exclusive James Hardie® Preferred Remodeler<br />
                CCB #136733 · Licensed, Bonded & Insured
              </p>
            </div>
          </body>
          </html>
        `

        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [leadInfo.email],
              subject: `Estimate Request Received — Northwest Siding`,
              html: customerHtml,
            }),
          })
        } catch (custErr) {
          console.error('Resend customer confirmation error:', custErr)
        }
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY is not configured in Cloudflare Pages environment variables. Lead logged locally.')
    }

    // 5. Successful Response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Estimate request submitted successfully.',
        lead: {
          firstName: leadInfo.firstName,
          service: leadInfo.service,
        },
      }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Fatal API error processing contact form:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An internal error occurred while processing your request. Please call us at (541) 688-2997.',
      }),
      {
        status: 500,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
