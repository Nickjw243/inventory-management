"use client"

import React, {useEffect, useState} from "react"
import { use } from "react"
import { apiGet, apiDelete } from "@/app/apiClient"
import "@/app/index.css"
import DCNavTabs from "@/app/components/DCNavTabs"

export default function DCBrandsPage({ params }) {
    const resolvedParams = use(params)
    const id = resolvedParams.id

    const [dc, setDc] = useState(null)
    const [brands, setBrands] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadBrands() {
            try {
                const data = await apiGet(`/api/dcs/${id}/brands`)
                setDc(data.distribution_center)
                setBrands(data.brands || [])
            } catch (err) {
                console.error("Error loading brands:", err)
                setError(String(err))
            }
        }
        loadBrands()
    }, [id])

    async function handleDeleteBrand(brandId) {
        if (!confirm('Are you sure you want to delete this brand?')) return
        try {
            const result = await apiDelete(`/api/dcs/${id}/brands/${brandId}`)
            alert(result.message || "Brand removed successfully")

            setBrands((prev) => prev.filter((b) => b.id !== brandId))
        } catch (err) {
            console.error("Error deleting brand:", err)
            alert(err.message)
        }
    }

    return (
        <div className="container">
            <header className="header">
                <h1>{dc || "DC"} - Brands</h1>
                {error && <p>{error}</p>}
                <DCNavTabs dcId={id} />
            </header>
            <div className="tab-content">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.country}</td>
                                <td>{item.description}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDeleteBrand(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}