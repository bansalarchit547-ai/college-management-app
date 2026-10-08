import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to provide persistent disk-file storage for students, staff, library, accounts
function diskDatabasePlugin(): Plugin {
  return {
    name: 'disk-database-api',
    configureServer(server) {
      const dataDir = path.resolve(__dirname, 'data')
      const dbFile = path.resolve(dataDir, 'database.json')

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/db') {
          if (req.method === 'GET') {
            if (fs.existsSync(dbFile)) {
              try {
                const data = fs.readFileSync(dbFile, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.end(data)
                return
              } catch (err) {
                console.error('Error reading database.json:', err)
              }
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ exists: false }))
            return
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk
            })
            req.on('end', () => {
              try {
                fs.writeFileSync(dbFile, body, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }))
              } catch (err) {
                console.error('Error writing database.json:', err)
                res.statusCode = 500
                res.end(JSON.stringify({ error: String(err) }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), diskDatabasePlugin()],
  server: {
    port: 3000,
    host: true
  }
})
