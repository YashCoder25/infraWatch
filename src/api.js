const BASE = '/api'

async function handle(res) {
  let body = null
  try {
    body = await res.json()
  } catch {
    // no JSON body
  }
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`)
  }
  return body
}

export function fetchProjects() {
  // Try the live API first; if it's unreachable (no server running, or GitHub
  // Pages static hosting) fall back to the bundled public/data.json snapshot.
  return fetch(`${BASE}/projects`)
    .then((res) => {
      if (!res.ok) throw new Error(`API ${res.status}`)
      return res.json()
    })
    .catch(() => fetch(`${import.meta.env.BASE_URL}data.json`).then(handle))
}

export function login(password) {
  return fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then(handle)
}

export function checkSession(token) {
  return fetch(`${BASE}/admin/session`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

export function logout(token) {
  return fetch(`${BASE}/admin/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

export function createProject(token, record) {
  return fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(record),
  }).then(handle)
}

export function updateProjectApi(token, id, record) {
  return fetch(`${BASE}/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(record),
  }).then(handle)
}

export function deleteProjectApi(token, id) {
  return fetch(`${BASE}/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}
