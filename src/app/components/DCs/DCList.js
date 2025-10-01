

function DcList({ dcs, onSelectDc }) {
    return (
        <div className="table-container">
            <table id="dcTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>City</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {dcs.map((dc) => (
                        <tr key={dc.id} onClick={() => onSelectDc(dc.id)}>
                            <td>{dc.name}</td>
                            <td>{dc.code}</td>
                            <td>{dc.city}</td>
                            <td>{dc.state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DcList