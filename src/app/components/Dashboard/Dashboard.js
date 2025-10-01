"use client"
import LowStockTable from "./LowStockTable"

function Dashboard({ summary, lowStock }) {
    return (
        <div id="dashboard" className="tab-pane active">
            <h2>Inventory Overview</h2>
            <div className="stats-grid">
                <div className="stat-card">Products: {summary.total_products}</div>
                <div className="stat-card">Brands: {summary.total_brands}</div>
                <div className="stat-card">Value: {summary.total_stock_value}</div>
                <div className="stat-card">Low Stock: {summary.low_stock_items}</div>
            </div>
            <h3>Low Stock Items</h3>
            <LowStockTable lowStock={lowStock} />
        </div>
    )
}

export default Dashboard