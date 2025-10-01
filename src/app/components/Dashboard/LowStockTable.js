

function LowStockTable({ lowStock }) {
    return (
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
                            <td>{item.name}</td>
                            <td>{item.brand?.name || "N/A"}</td>
                            <td className="low-stock">{item.stock}</td>
                            <td>${item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LowStockTable