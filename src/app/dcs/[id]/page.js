"use client"

import React from "react"
import { useEffect, useState } from "react"
import {apiGet, apiPost} from "../../apiClient"
import Link from "next/link"
import "../../index.css"
import DCNavTabs from "@/app/components/DCNavTabs"

export default function DCDetailPage({ params }) {
    const resolvedParams = React.use(params)
    const id = resolvedParams.id

    const [dc, setDc] = useState(null)
    const [inventory, setInventory] = useState([])
    const [summary, setSummary] = useState(null)
    const [lowStock, setLowStock] = useState([])
    const [loadingLowStock, setLoadingLowStock] = useState(false)
    const [error, setError] = useState("")
    

    useEffect(() => {
        async function load() {
            try {
                const inventoryData = await apiGet(`/api/dcs/${id}/inventory`)
                setDc(inventoryData.distribution_center)
                setInventory(inventoryData.inventory || [])
                await loadDashboard()
                await loadLowStock()
            } catch (e) {
                setError(String(e))
            }
        }
        load()
    }, [id])

    async function loadDashboard() {
        try {
            const data = await apiGet(`/api/dcs/${id}/summary`)
            setSummary(data)
        } catch (error) {
            console.error("Error loading summary:", error)
        }
    }

    async function loadLowStock(threshold = 10) {
        try {
            setLoadingLowStock(true)
            const data = await apiGet(`/api/dcs/${id}/low-stock?threshold=${threshold}`)
            setLowStock(data)
        } catch (error) {
            console.error("Error loading low stock items:", error)
        } finally {
            setLoadingLowStock(false)
        }
    }

    return (
        <div className="container">
            <header className="header">
                <h1>{dc?.name || "DC"} Inventory</h1>
                {error && <p>{error}</p>}
                <DCNavTabs dcId={id} />
            </header>
            <div className="tab-content">
                <div id="dashboard" className="tab-pane active">
                    <h2>Inventory Overview</h2>
                    <div className="stats-grid">
                        {summary ? (
                            <>
                                <div className="stat-card">Products: {summary.total_products}</div>
                                <div className="stat-card">Brands: {summary.total_brands}</div>
                                <div className="stat-card">Value: {summary.total_stock_value}</div>
                                <div className="stat-card">Low Stock: {summary.low_stock_items}</div>
                            </>
                        ) : (
                            <p>Loading summary...</p>
                        )}
                    </div>
                    <h3>Low Stock Items</h3>
                    {loadingLowStock ? (
                        <p>Loading...</p>
                    ) : lowStock.length === 0 ? (
                        <p>No low stock items!</p>
                    ) : (
                        <div className="table-container">
                            <table id="lowStockTable">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand</th>
                                        <th>Stock</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStock.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td>{item.product.brand.name}</td>
                                            <td className="low-stock">{item.quantity}</td>
                                            <td>${item.product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}