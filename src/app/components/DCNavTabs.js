"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DCNavTabs({ dcId }) {
    const pathname = usePathname()

    const tabs = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: `/dcs/${dcId}` },
        { name: "Products", path: `/dcs/${dcId}/products` },
        { name: "Brand", path: `/dcs/${dcId}/brands` },
        { name: "Stock Management", path: `/dcs/${dcId}/stock` },
    ]

    function isActive(path) {
        if (path === "/" && pathname === "/") return true
        if (path === `/dcs/${dcId}` && pathname === `/dcs/${dcId}`) return true
        if (pathname.startsWith(path) && path !== "/" && path !== `/dcs/${dcId}`) {
            return true
        }
        return false
    }

    return (
        <div className="nav-tabs">
            {tabs.map((tab) => (
                <Link
                    key={tab.name}
                    href={tab.path}
                    className={`nav-tab ${isActive(tab.path) ? "active" : ""}`}
                >
                    {tab.name}
                </Link>
            ))}
        </div>
    )
}