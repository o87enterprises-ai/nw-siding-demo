import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev middleware simulating Cloudflare Pages Functions
function localDevApiPlugin() {
  return {
    name: 'local-dev-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              console.log('📬 [Local Dev Server] Estimate Request received:')
              console.log(data)

              // Check honeypot
              if (data.hp_website && data.hp_website.length > 0) {
                console.log('🛡️ [Local Dev Server] Blocked honeypot bot submission.')
              }

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(
                JSON.stringify({
                  success: true,
                  mode: 'local-dev',
                  message: 'Estimate request captured in local dev server!',
                  lead: { firstName: data.firstName, service: data.service },
                })
              )
            } catch (err) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON request' }))
            }
          })
          return
        }
        next()
      })

      server.middlewares.use('/api/health', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(
            JSON.stringify({
              status: 'ok',
              service: 'nw-siding-api',
              mode: 'local-dev',
              timestamp: new Date().toISOString(),
            })
          )
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localDevApiPlugin()],
})
