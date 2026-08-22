import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, 'data.json')
const DIST_PATH = path.join(__dirname, '..', 'dist')

// ---- Config -------------------------------------------------------------
// Change this before deploying anywhere real. For real deployments, set the
// ADMIN_PASSWORD environment variable instead of editing this file.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'infrawatch2026'
const TOKEN_TTL_MS = 4 * 60 * 60 * 1000 // 4 hours

const app = express()
app.use(cors())
app.use(express.json())

// ---- Tiny in-memory session store ---------------------------------------
const sessions = new Map() // token -> expiresAt

function issueToken() {
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, Date.now() + TOKEN_TTL_MS)
  return token
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const expiresAt = token && sessions.get(token)
  if (!expiresAt || expiresAt < Date.now()) {
    if (token) sessions.delete(token)
    return res.status(401).json({ error: 'Unauthorized. Please log in again.' })
  }
  // sliding expiry
  sessions.set(token, Date.now() + TOKEN_TTL_MS)
  next()
}

// ---- Data helpers ---------------------------------------------------------
function readData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeData(list) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2) + '\n', 'utf-8')
}

function nextId(list) {
  const nums = list.map((p) => parseInt(String(p.id).replace('IW-', ''), 10) || 0)
  const n = (Math.max(0, ...nums) + 1).toString().padStart(4, '0')
  return `IW-${n}`
}

// ---- Public routes ---------------------------------------------------------
app.get('/api/projects', (req, res) => {
  try {
    res.json(readData())
  } catch (err) {
    res.status(500).json({ error: 'Could not read project data.' })
  }
})

// ---- Admin auth -------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }
  res.json({ token: issueToken(), expiresInMs: TOKEN_TTL_MS })
})

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) sessions.delete(token)
  res.json({ ok: true })
})

app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({ ok: true })
})

// ---- Admin CRUD (all require a valid session token) -------------------------
app.post('/api/projects', requireAdmin, (req, res) => {
  try {
    const list = readData()
    const record = { ...req.body, id: nextId(list) }
    const updated = [...list, record]
    writeData(updated)
    res.status(201).json(record)
  } catch (err) {
    res.status(500).json({ error: 'Could not save project.' })
  }
})

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  try {
    const list = readData()
    const idx = list.findIndex((p) => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Project not found.' })
    const updatedRecord = { ...list[idx], ...req.body, id: list[idx].id }
    list[idx] = updatedRecord
    writeData(list)
    res.json(updatedRecord)
  } catch (err) {
    res.status(500).json({ error: 'Could not update project.' })
  }
})

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  try {
    const list = readData()
    const updated = list.filter((p) => p.id !== req.params.id)
    if (updated.length === list.length) return res.status(404).json({ error: 'Project not found.' })
    writeData(updated)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete project.' })
  }
})

app.post('/api/admin/reset', requireAdmin, (req, res) => {
  // Reset endpoint intentionally left as a no-op guard: resetting to "seed"
  // now means re-reading whatever is currently on disk, since data.json IS
  // the live database. Kept for API symmetry with the old client-only demo.
  try {
    res.json(readData())
  } catch (err) {
    res.status(500).json({ error: 'Could not read project data.' })
  }
})

// ---- Serve the built frontend in production ---------------------------------
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH))
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`InfraWatch API listening on http://localhost:${PORT}`)
  console.log(`Admin password: ${ADMIN_PASSWORD} (set ADMIN_PASSWORD env var to change it)`)
})
