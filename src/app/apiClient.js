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

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        console.error("API error response:", data)
        const message = data.error || `POST ${path} failed: ${res.status}`
        throw new Error(message)
    }
    return data
}

export async function apiPut(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body || {}),
    })
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`)
    return res.json()
}

export async function apiDelete(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE'
    })
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
    return res.json()
}

export async function adjustStock(dcId, productId, amount, action = 'add') {
    return apiPost(`/api/dcs/${dcId}/inventory/${productId}/adjust`, {
        amount,
        action,
    })
}