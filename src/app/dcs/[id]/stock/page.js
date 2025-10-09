"use client"

import React, { useEffect, useState } from "react"
import { use } from "react"
import { apiGet, apiPost } from "../../../apiClient"
import "../../../index.css"
import DCNavTabs from "@/app/components/DCNavTabs"

export default function DCStockManagementPage({ params }) {
    const resolvedParams = use(params)
    const id = resolvedParams.id

    const [dc, setDc] = useState(null)
    const [products, setProducts] = useState([])
    const [allDcs, setAllDcs] = useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [inputValues, setInputValues] = useState({})
    const [showTransferForm, setShowTransferForm] = useState(false)
    
    const [transferData, setTransferData] = useState({
        product_id: "",
        to_dc_id: "",
        amount: "",
    })

    async function loadProducts() {
        try {
            const data = await apiGet(`/api/dcs/${id}/inventory`)
            setDc(data.distribution_center)
            setProducts(data.inventory || [])
        } catch (err) {
            console.error("Error loading products:", err)
            setError(String(err))
        }
    }

    async function loadAllDcs() {
        try {
            const data = await apiGet("/api/dcs")
            setAllDcs(data)
        } catch (err) {
            console.error("Error loading DCs:", err)
        }
    }

    useEffect(() => {
        loadProducts()
        loadAllDcs()
    }, [id])

    async function adjustStock(productId, action) {
        const amount = parseInt(inputValues[productId] || 0)
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount')
            return
        }

        try {
            const result = await apiPost(`/api/dcs/${id}/inventory/${productId}/adjust`, { 
                amount: Number(amount),
                action: action,
            })
            
            setMessage(`Stock ${action === "subtract" ? "removed" : "added"} successfully!`)
            setTimeout(() => setMessage(""), 3000)

            setInputValues((prev) => ({ ...prev, [productId]: ""}))

            loadProducts()
        } catch (error) {
            console.error('Error adjusting stock:', error)
            alert('Error adjusting stock')
        }
    }

    async function handleTransferProduct(e) {
        e.preventDefault()
        const {product_id, to_dc_id, amount} = transferData
        if (!product_id || !to_dc_id || !amount) {
            alert("Please fill in all fields.")
            return
        }

        try {
            const res = await apiPost("/api/dcs/transfer", {
                product_id: Number(product_id),
                from_dc_id: Number(id),
                to_dc_id: Number(to_dc_id),
                amount: Number(amount),
            })
            setMessage(res.message)
            setTimeout(() => setMessage(""), 3000)

            setTransferData({product_id: "", to_dc_id: "", amount: ""})
            setShowTransferForm(false)
            loadProducts()
        } catch (err) {
            console.error("Error transferring product:", err)
            alert("Error transferring product.")
        }
    }

    return (
        <div className="container">
            <header className="header">
                <h1>{dc?.name || "DC"} - Stock Management</h1>
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}
                <DCNavTabs dcId={id} />
            </header>
            <div className="tab-content">
                <table>
                    <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Type</th>
                                <th>ABV</th>
                                <th>Package</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Brand</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product?.name}</td>
                                    <td>{item.product?.sku}</td>
                                    <td>{item.product?.type}</td>
                                    <td>{item.product?.abv}</td>
                                    <td>{item.product?.package_size}</td>
                                    <td>{item.product?.price?.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.product?.brand?.name}</td>
                                    <td className="stock-controls">
                                        <input
                                            type="number"
                                            className="stock-input"
                                            placeholder="Qty"
                                            min="1"
                                            value={inputValues[item.product.id] || ""}
                                            onChange={(e) =>
                                                setInputValues((prev) => ({
                                                    ...prev,
                                                    [item.product.id]: e.target.value,
                                                }))
                                            }
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={() => adjustStock(item.product.id, "add")}
                                        >
                                            Add
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => adjustStock(item.product.id, "subtract")}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
                <div className="form-group">
                    <button className="btn">Add New Product</button>
                    <button className="btn">Add New Brand</button>
                    <button 
                        className="btn" 
                        onClick={() => setShowTransferForm((prev) => !prev)}
                    >
                        {showTransferForm ? "Cancel Transfer" : "Transfer Product"}
                    </button>
                </div>
                {showTransferForm && (
                    <div className="transfer-section">
                        <form onSubmit={handleTransferProduct} className="transfer-form" id="transferProductForm">
                            <h3>Transfer Products</h3>
                            <label>Product:</label>
                            <select
                                value={transferData.product_id}
                                onChange={(e) =>
                                    setTransferData((prev) => ({
                                        ...prev,
                                        product_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Select Product</option>
                                {products.map((item) => (
                                    <option key={item.product.id} value={item.product.id}>
                                        {item.product.name} (Qty: {item.quantity})
                                    </option>
                                ))}
                            </select>
                            <label>Transfer To DC:</label>
                            <select
                                value={transferData.to_dc_id}
                                onChange={(e) =>
                                    setTransferData((prev) => ({
                                        ...prev,
                                        to_dc_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Select Destination DC</option>
                                {allDcs
                                    .filter((d) => d.id !== Number(id))
                                    .map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                            </select>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={transferData.amount}
                                onChange={(e) =>
                                    setTransferData((prev) => ({
                                        ...prev,
                                        amount: e.target.value,
                                    }))
                                }
                            />
                            <button type="submit" className="btn btn-success">
                                Transfer
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}