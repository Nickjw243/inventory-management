const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5500'

export async function apiGet(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
        cache: 'no-store',
    })
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return res.json()
}

export async function apiPost(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body || {}),
    })
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
    return res.json()
}