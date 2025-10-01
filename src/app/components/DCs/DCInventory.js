import React from "react"
import { useState, useEffect } from "react"


function DcInventory({ dcId, API_BASE }) {
    const [dcInventory, setDcInventory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!dcId) return
        async function fetchInventory() {
            try {
                setLoading(true)
                const response = await fetch(`${API_BASE}/dcs/${dcId}/inventory`)
                const data = await response.json()
                setDcInventory(data)
            } catch (error) {
                console.error("Error loading DC inventory:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchInventory()
    }, [dcId, API_BASE])

    if (!dcId) return <p>Select a distribution center to view inventory.</p>
    if (loading) return <p>Loading inventory...</p>
    if (!dcInventory) return <p>No inventory found.</p>

    return (
        <div className="dc-inventory">
            <h3>{dcInventory.distribution_center.name} Inventory</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Stock</th>
                        <th>Package Size</th>
                    </tr>
                </thead>
                <tbody>
                    {dcInventory.inventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.product?.name}</td>
                            <td>{item.product?.sku}</td>
                            <td>{item.stock}</td>
                            <td>{item.product?.package_size}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DcInventory