"use client"

import { useEffect, useState } from "react"
import { apiGet } from "./apiClient"
import Link from "next/link"

export default function NavClient() {
    const [dcs, setDcs] = useState([])
    const [selected, setSelected] = useState("")

    useEffect(() => {
        async function load() {
            try {
                const list = await apiGet("/api/dcs")
                setDcs(list)
            } catch {}
        }
        load()
    }, [])

    function onGoToDC() {
        if (selected) window.location.href = `/dcs/${selected}`
    }

    return (
        <nav>
            <Link className="underline" href="/">Home</Link>
            <Link className="underline" href="/dcs">All DCs</Link>
            <div>
                <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                    <option value="">Select DC</option>
                    {dcs.map((dc) => (
                        <option key={dc.id} value={dc.id}>{dc.name} ({dc.code})</option>
                    ))}
                </select>
                <button onClick={onGoToDC} disabled={!selected}>Go</button>
            </div>
        </nav>
    )
}