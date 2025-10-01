import React from "react"

export default function InventoryTable({ dcInventory }) {
    if (!dcInventory?.inventory?.length) {
        return <p>No inventory data for this DC.</p>
    }

    return (
        <div className="table-container">
            <h3>Inventory for {dcInventory.distribution_center.name}</h3>
            <table>
                <thead>
                <tbody>
                    {dcInventory.inventory.map((inv) => (
                        <tr key={inv.id}>
                            <td>{inv.product.name}</td>
                        </tr>
                    ))}
                </tbody>
                </thead>
            </table>
        </div>
    )
}