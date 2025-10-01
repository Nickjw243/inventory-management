

function BrandList({ brands, deleteBrand }) {
    return (
        <div className="table-container">
            <table id="brandsTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((b) => (
                        <tr key={b.id}>
                        <td>{b.name}</td>
                        <td>{b.country}</td>
                        <td>{b.description}</td>
                        <td>
                            <button type="button" className="btn btn-danger" onClick={() => deleteBrand(b.id)}>Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default BrandList