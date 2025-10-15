"use client"

import React, { useEffect, useState } from "react"
import { use } from "react"
import { apiGet } from "../../../apiClient"
import Link from "next/link"
import "../../../index.css"
import DCNavTabs from "@/app/components/DCNavTabs"

export default function DCProductsPage({ params }) {
    const resolvedParams = use(params)
    const id = resolvedParams.id

    const [dc, setDc] = useState(null)
    const [products, setProducts] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await apiGet(`/api/dcs/${id}/inventory`)
                setDc(data.distribution_center)
                setProducts(data.inventory || [])
            } catch (error) {
                console.error("Error loading products:", error)
                setError(String(error))
            }
        }
        loadProducts()
    }, [id])

    return (
        <div className="container">
            <header className="header">
                <h1>{dc?.name || "DC"} - Products</h1>
                {error && <p>{error}</p>}
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
                                    <td className={item.quantity < 10 ? "low-stock" : ""}>{item.quantity}</td>
                                    <td>{item.product?.brand?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    )
}