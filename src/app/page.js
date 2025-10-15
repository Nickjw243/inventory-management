// "use client"

// import { useState, useEffect } from "react"
// import "./index.css"


// function Home() {

//   const [activeTab, setActiveTab] = useState("dashboard")
//   const [products, setProducts] = useState([])
//   const [brands, setBrands] = useState([])
//   const [lowStock, setLowStock] = useState([])
//   const [summary, setSummary] = useState({})
//   const [showProductForm, setShowProductForm] = useState(false)
//   const [showBrandForm, setShowBrandForm] = useState(false)
//   const [dcs, setDcs] = useState([])
//   const API_BASE = 'http://127.0.0.1:5500/api'

//   useEffect(() => {
//     if (activeTab === "dashboard") {
//       loadDashboard()
//     } else if (activeTab === "products") {
//       loadProducts()
//       loadBrandsForSelect()
//     } else if (activeTab === "brands") {
//       loadBrands()
//     } else if (activeTab === "stock") {
//       loadProducts()
//     } else if (activeTab === "dcs") {
//       loadDcs()
//     }
//   }, [activeTab])

//   // Dashboard functions
//   async function loadDashboard() {
//     try {
//         const [summaryResponse, lowStockResponse] = await Promise.all([
//             fetch(`${API_BASE}/inventory/summary`),
//             fetch(`${API_BASE}/products/low-stock`)
//         ])

//         setSummary(await summaryResponse.json())
//         setLowStock(await lowStockResponse.json())

//     } catch (error) {
//         console.error('Error loading dashboard:', error)
//     }
//   }

//   // Product functions
//   async function loadProducts() {
//     try {
//         const response = await fetch(`${API_BASE}/products`)
//         setProducts(await response.json())
//     } catch (error) {
//         console.error('Error loading products:', error)
//     }
//   }

//   async function loadBrandsForSelect() {
//     try {
//         const response = await fetch(`${API_BASE}/brands`)
//         setBrands(await response.json())
//     } catch (error) {
//         console.error('Error loading brands:', error)
//     }
//   }

//   async function handleAddProduct(e) {
//     e.preventDefault()
//     const form = e.target
//     const productData = {
//       name: form.productName.value,
//       sku: form.productSku.value,
//       brand_id: parseInt(form.productBrand.value),
//       package_size: form.productPackageSize.value,
//       price: parseFloat(form.productPrice.value),
//       type: form.productType.value,
//       abv: parseFloat(form.productAbv.value) || 0,
//       stock: parseInt(form.productStock.value),
//     }
//     try {
//       const response = await fetch(`${API_BASE}/products`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json"},
//         body: JSON.stringify(productData),
//       })
//       if (response.ok) {
//         alert("Product added successfully!")
//         setShowProductForm(false)
//         loadProducts()
//         loadDashboard()
//       } else {
//         const error = await response.json()
//         alert("Error: " + error.error)
//       }
//     } catch (error) {
//       console.error("Error adding product:", error)
//     }
//   }

//   async function deleteProduct(id) {
//       if (!confirm('Are you sure you want to delete this product?')) return
//       try {
//           const response = await fetch(`${API_BASE}/products/${id}`, {
//               method: 'DELETE'
//           })

//           if (response.ok) {
//               alert('Product deleted successfully!')
//               loadProducts()
//               loadDashboard()
//           }
//       } catch (error) {
//           console.error('Error deleteing product:', error)
//       }
//   }

//   // Brand functions
//   async function loadBrands() {
//       try {
//           const response = await fetch(`${API_BASE}/brands`)
//           setBrands(await response.json())
//       } catch (error) {
//           console.error('Error loading brands:', error)
//       }
//   }

//   async function handleAddBrand(e) {
//     e.preventDefault()
//     const form = e.target
//     const brandData = {
//       name: form.brandName.value,
//       country: form.brandCountry.value,
//       description: form.brandDescription.value,
//     }
//     try {
//       const response = await fetch(`${API_BASE}/brands`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(brandData),
//       })
//       if (response.ok) {
//         alert("Brand added successfully!")
//         setShowBrandForm(false)
//         loadBrands()
//         loadDashboard()
//       }
//     } catch (error) {
//       console.error("Error adding brand:", error)
//     }
//   }

//   async function deleteBrand(id) {
//     if (!confirm('Are you sure you want to delete this brand?')) return
//       try {
//           const response = await fetch(`${API_BASE}/brands/${id}`, {
//               method: 'DELETE'
//           });
          
//           if (response.ok) {
//               alert('Brand deleted successfully!');
//               loadBrands();
//               loadDashboard();
//           }
//       } catch (error) {
//           console.error('Error deleting brand:', error);
//       }
//   }

//   async function adjustStock(productId, action, amount) {
      
//       if (isNaN(amount) || amount <= 0) {
//           alert('Please enter a valid amount');
//           return;
//       }
//       const adjustment = action === "subtract" ? -amount : amount

//       try {
//           const response = await fetch(`${API_BASE}/products/${productId}/adjust-stock`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                   amount: adjustment,
//               })
//           });
          
//           const result = await response.json();
          
//           if (response.ok) {
//               alert(`Stock ${action === "subtract" ? "removed" : "added"} successfully! New stock: ${result.new_stock}`);
//               loadProducts();
//               loadDashboard();
//           } else {
//               alert('Error: ' + result.error);
//           }
//       } catch (error) {
//           console.error('Error adjusting stock:', error);
//           alert('Error adjusting stock');
//       }
//   }

//   async function loadDcs() {
//     try {
//         const response = await fetch(`${API_BASE}/dcs`)
//         setDcs(await response.json())
//     } catch (error) {
//         console.error('Error loading DCs:', error)
//     }
//   }

//   return (
//     <div className="container">
//       <div className="header">
//         <h1>Beer Inventory System</h1>
//         <div className="nav-tabs">
//           {["dashboard", "products", "brands", "stock", "DCs"].map((tab) => (
//             <button
//               key={tab}
//               className={`nav-tab ${activeTab === tab ? "active" : ""}`}
//               onClick={() => setActiveTab(tab)}
//               >{tab[0].toUpperCase() + tab.slice(1)}</button>
//           ))}
//         </div>

//         <div className="tab-content">
//           {/* Dashboard */}
//           {activeTab === "dashboard" && (
//             <div id="dashboard" className="tab-pane active">
//               <h2>Inventory Overview</h2>
//               <div className="stats-grid">
//                 <div className="stat-card">Products: {summary.total_products}</div>
//                 <div className="stat-card">Brands: {summary.total_brands}</div>
//                 <div className="stat-card">Value: {summary.total_stock_value}</div>
//                 <div className="stat-card">Low Stock: {summary.low_stock_items}</div>
//               </div>
//               <h3>Low Stock Items</h3>
//               <div className="table-container">
//                 <table id="lowStockTable">
//                   <thead>
//                     <tr>
//                       <th>Product</th><th>Brand</th><th>Stock</th><th>Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {lowStock.map((item) => (
//                       <tr key={item.id}>
//                         <td>{item.name}</td>
//                         <td>{item.brand?.name || "N/A"}</td>
//                         <td className="low-stock">{item.stock}</td>
//                         <td> ${item.price}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             )}
          

//           {/* Products */}
//           {activeTab === "products" && (
//             <div className="tab-content">
//               <div id="products" className="tab-pane">
//                 <h2>Product Management</h2>
//                 <div className="form-group">
//                   <button className="btn" onClick={() => setShowProductForm(!showProductForm)}>
//                     Add New Product
//                   </button>
//                 </div>
//                 {showProductForm && (
//                 <div id="addProductForm">
//                   <h3>Add New Product</h3>
//                   <form id="productForm" onSubmit={handleAddProduct}>
//                     <div className="form-group">
//                       <label>Product Name:</label>
//                       <input id="productName" required />
//                     </div>
//                     <div className="form-group">
//                       <label>SKU:</label>
//                       <input id="productSku" required />
//                     </div>
//                     <div className="form-group">
//                       <label>Brand:</label>
//                       <select id="productBrand" required>
//                         {brands.map((b) => (
//                           <option key={b.id} value={b.id}>{b.name}</option>
//                         ))}
//                       </select>
//                       </div>
//                     <div className="form-group">
//                       <label>Package Size:</label>
//                       <input id="productPackageSize" />
//                     </div>
//                     <div className="form-group">
//                       <label>Price:</label>
//                       <input id="productPrice" type="number" step="0.01" required />
//                     </div>
//                     <div className="form-group">
//                       <label>Type:</label>
//                       <input id="productType" />
//                     </div>
//                     <div className="form-group">
//                       <label>ABV:</label>
//                       <input id="productAbv" type="number" step="0.1" />
//                     </div>
//                     <div className="form-group">
//                       <label>Initial Stock:</label>
//                       <input id="productStock" type="number" required />
//                     </div>
//                     <button className="btn" type="submit">Save Product</button>
//                     <button className="btn btn-danger" type="button" onClick={() => setShowProductForm(!showProductForm)}>Cancel</button>
//                   </form>
//                 </div>
//                 )}
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Name</th><th>SKU</th><th>Brand</th><th>Stock</th><th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((p) => (
//                       <tr key={p.id}>
//                         <td>{p.name}</td>
//                         <td>{p.sku}</td>
//                         <td>{p.brand?.name || "N/A"}</td>
//                         <td className={p.stock < 10 ? "low-stock" : ""}>{p.stock}</td>
//                         <td><button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Brands */}
//           {activeTab === "brands" && (
//           <div id="brands" className="tab-pane">
//             <h2>Brand Management</h2>
//             <div className="form-group">
//               <button className="btn" onClick={() => setShowBrandForm(!showBrandForm)}>
//                 Add New Brand
//               </button>
//             </div>
//             {showBrandForm && (
//             <div id="addBrandForm">
//               <h3>Add New Brand</h3>
//               <form id="brandForm" onSubmit={handleAddBrand}>
//                 <div className="form-group">
//                   <label>Name:</label>
//                   <input id="brandName" required />
//                 </div>
//                 <div className="form-group">
//                   <label>Country:</label>
//                   <input id="brandCountry" required />
//                 </div>
//                 <div className="form-group">
//                   <label>Description:</label>
//                   <input id="brandDescription" type="text" placeholder="Brief description of the brand"/>
//                 </div>
//                 <button type="submit" className="btn">Save Brand</button>
//                 <button type="button" className="btn btn-danger" onClick={() => setShowBrandForm(!showBrandForm)}>Cancel</button>
//               </form>
//             </div>
//             )}
//             <div className="table-container">
//               <table id="brandsTable">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Country</th>
//                     <th>Description</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {brands.map((b) => (
//                     <tr key={b.id}>
//                       <td>{b.name}</td>
//                       <td>{b.country}</td>
//                       <td>{b.description}</td>
//                       <td>
//                         <button type="button" className="btn btn-danger" onClick={() => deleteBrand(b.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           )}

//           {/* Stock Management */}
//           {activeTab === "stock" && (
//             <div id="stock" className="tab-pane">
//               <h2>Stock Management</h2>
//               <div className="table-container">
//                 <table id="stockTable">
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Brand</th>
//                       <th>Current Stock</th>
//                       <th>Price</th>
//                       <th>Stock Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map((p) => {
//                       let inputRef
//                       return (
//                         <tr key={p.id}>
//                           <td>{p.name}</td>
//                           <td>{p.brand?.name || "N/A"}</td>
//                           <td className={p.stock < 10 ? "low-stock" : ""}>{p.stock}</td>
//                           <td>${p.price}</td>
//                           <td className="stock-controls">
                            // <input type="number" className="stock-input" id="stockInputs${p.id}" placeholder="Qty" min="1" ref={(el) => (inputRef = el)}></input>
                            // <button className="btn btn-success" onClick={async () => { await adjustStock(p.id, "add", parseInt(inputRef.value)) 
                            //   inputRef.value = ""}}>Add</button>
                            // <button className="btn btn-danger" onClick={async () => {await adjustStock(p.id, "subtract", parseInt(inputRef.value))
//                               inputRef.value = ""}}>Delete</button>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//           {/* DC Management */}
//           {activeTab === "dcs" && (
//             <div id="dcs" className="tab-pane">
//               <h2>Distribution Centers</h2>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home

"use client"

import { useEffect, useState } from "react"
import { apiGet } from "./apiClient"
import "./index.css"

function Home() {
    const [dcs, setDcs] = useState([])
    const [selected, setSelected] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const list = await apiGet("/api/dcs")
                setDcs(list)
                if (list?.length) setSelected(String(list[0].id))
            } catch (e) {
                setError(String(e))
            }
        })()
    }, [])

    function goToSelected(id) {
        window.location.href = `/dcs/${id}`
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Beer Inventory System</h1>
                <div className="tab-content">
                    <div id="home">
                        <h2>Choose a Distribution Center</h2>
                        {error && <p>{error}</p>}
                        <div>
                            {/* <select value={selected} onChange={(e) => setSelected(e.target.value)}
                            >
                                {dcs.map((dc) => (
                                    <option key={dc.id} value={dc.id}>
                                        {dc.name} ({dc.code})
                                    </option>
                                ))}
                            </select>
                            <button onClick={goToSelected} disabled={!selected}>View</button> */}
                            <table id="DC-table">
                                <tbody>
                                    {dcs.map((dc) => (
                                        <tr key={dc.id}>
                                            <td onClick={() => goToSelected(dc.id)}>{dc.name} ({dc.code})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home