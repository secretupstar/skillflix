import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.resolve(__dirname, 'data.json')

function localStoragePlugin() {
  return {
    name: 'local-file-storage',
    configureServer(server) {
      server.middlewares.use('/api/data', (req, res) => {
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(DATA_FILE)) {
              const data = fs.readFileSync(DATA_FILE, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(data)
            } else {
              res.setHeader('Content-Type', 'application/json')
              res.end('null')
            }
          } catch {
            res.statusCode = 500
            res.end('{"error":"Failed to read data"}')
          }
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              JSON.parse(body)
              fs.writeFileSync(DATA_FILE, body, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end('{"ok":true}')
            } catch {
              res.statusCode = 400
              res.end('{"error":"Invalid JSON"}')
            }
          })
        } else {
          res.statusCode = 405
          res.end('{"error":"Method not allowed"}')
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localStoragePlugin()],
})
