

function ProductList({ products, deleteProduct }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Brand</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.sku}</td>
                        <td>{p.brand?.name || "N/A"}</td>
                        <td className={p.stock < 10 ? "low-stock" : ""}>{p.stock}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ProductList