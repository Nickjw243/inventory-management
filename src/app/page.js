
"use client"

import { useEffect, useState } from "react"
import { apiGet } from "./apiClient"
import "./index.css"

function Home() {
    const [dcs, setDcs] = useState([])
    const [selected, setSelected] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const list = await apiGet("/api/dcs")
                setDcs(list)
                if (list?.length) setSelected(String(list[0].id))
            } catch (e) {
                setError(String(e))
            }
        })()
    }, [])

    function goToSelected(id) {
        window.location.href = `/dcs/${id}`
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Beer Inventory System</h1>
                <div className="tab-content">
                    <div id="home">
                        <h2>Choose a Distribution Center</h2>
                        {error && <p>{error}</p>}
                        <div>
                            <table id="DC-table">
                                <tbody>
                                    {dcs.map((dc) => (
                                        <tr key={dc.id}>
                                            <td onClick={() => goToSelected(dc.id)}>{dc.name} ({dc.code})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home