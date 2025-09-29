"use client"

import { useState, useEffect } from "react"
import "./index.css"


function Home() {

  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [summary, setSummary] = useState({})
  const [showProductForm, setShowProductForm] = useState(false)
  const [showBrandForm, setShowBrandForm] = useState(false)
  const API_BASE = 'http://127.0.0.1:5500/api'

  // Tab switching
  // function showTab(tabName) {
  //     // Hide all tab panes
  //     setActiveTab(tabName)

  //     // Load data for the tab
  //     if (tabName === 'dashboard') {
  //         loadDashboard();
  //     } else if (tabName === 'products') {
  //         loadProducts()
  //         loadBrandsForSelect()
  //     } else if (tabName === 'brands') {
  //         loadBrands()
  //     } else if (tabName === 'stock') {
  //         loadStockManagement()
  //     }
  // }

  useEffect(() => {
    if (activeTab === "dashboard") {
      loadDashboard()
    } else if (activeTab === "products") {
      loadProducts()
      loadBrandsForSelect()
    } else if (activeTab === "brands") {
      loadBrands()
    } else if (activeTab === "stock") {
      loadProducts()
    }
  }, [activeTab])

  // Dashboard functions
  async function loadDashboard() {
    try {
        const [summaryResponse, lowStockResponse] = await Promise.all([
            fetch(`${API_BASE}/inventory/summary`),
            fetch(`${API_BASE}/products/low-stock`)
        ])

        setSummary(await summaryResponse.json())
        setLowStock(await lowStockResponse.json())

        // // Update stats
        // document.getElementById('statsGrid').innerHTML = `
        //     <div class="stat-card">
        //         <div class="stat-number">${summary.total_products}</div>
        //         <div class="stat-label">Total Products</div>
        //     </div>
        //     <div class="stat-card">
        //         <div class="stat-number">${summary.total_brands}</div>
        //         <div class="stat-label">Total Brands</div>
        //     </div>
        //     <div class="stat-card">
        //         <div class="stat-number">${summary.total_stock_value}</div>
        //         <div class="stat-label">Total Stock Value</div>
        //     </div>
        //     <div class="stat-card">
        //         <div class="stat-number">${summary.low_stock_items}</div>
        //         <div class="stat-label">Low Stock Items</div>
        //     </div>
        // `

        // // Update low stock table
        // const lowStockTableBody = document.querySelector('#lowStockTable tbody')
        // lowStockTableBody.innerHTML = lowStockItems.map(item => `
        //     <tr>
        //         <td>${item.name}</td>
        //         <td>${item.brand?.name || 'N/A'}</td>
        //         <td><span class="low-stock">${item.stock}</span></td>
        //         <td>$${item.price}</td>
        //     </tr>
        // `).join('')
    } catch (error) {
        console.error('Error loading dashboard:', error)
    }
  }

  // Product functions
  async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`)
        setProducts(await response.json())

        // const tableBody = document.querySelector('#productsTable tbody')
        // tableBody.innerHTML = products.map(product => `
        //     <tr>
        //         <td>${product.name}</td>
        //         <td>${product.sku}</td>
        //         <td>${product.brand?.name || 'N/A'}</td>
        //         <td>${product.package_size}</td>
        //         <td>${product.price}</td>
        //         <td>${product.type}</td>
        //         <td>${product.abv}</td>
        //         <td>${product.stock < 10 ? `<span class="low-stock">${product.stock}</span>` : product.stock}</td>
        //         <td>
        //             <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
        //         </td>
        //     </tr>
        // `).join('')
    } catch (error) {
        console.error('Error loading products:', error)
    }
  }

  async function loadBrandsForSelect() {
    try {
        const response = await fetch(`${API_BASE}/brands`)
        setBrands(await response.json())

        // const select = document.getElementById('productBrand')
        // select.innerHTML = brands.map(brand => 
        //     `<option value="${brand.id}">${brand.name}</option>`
        // ).join('')
    } catch (error) {
        console.error('Error loading brands:', error)
    }
  }

  // function showAddProductForm() {
  //     document.getElementById('addProductForm').style.display = 'block'
  // }

  // function hideAddProductForm() {
  //     document.getElementById('addProductForm').style.display = 'none'
  //     document.getElementById('productForm').reset()
  // }

  // document.getElementById('productForm').addEventListener('submit', async (e) => {
  //     e.preventDefault()

  //     const productData = {
  //         name: document.getElementById('productName').value,
  //         sku: document.getElementById('productSku').value,
  //         brand_id: parseInt(document.getElementById('productBrand').value),
  //         package_size: document.getElementById('productPackageSize').value,
  //         price: parseFloat(document.getElementById('productPrice').value),
  //         type: document.getElementById('productType').value,
  //         abv: parseFloat(document.getElementById('productAbv').value) || 0,
  //         stock: parseInt(document.getElementById('productStock').value)
  //     }

  //     try {
  //         const response = await fetch(`${API_BASE}/products`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(productData)
  //         })

  //         if (response.ok) {
  //             alert('product added successfully!')
  //             hideAddProductForm()
  //             loadProducts()
  //             loadDashboard()
  //         } else {
  //             const error = await response.json()
  //             alert('Error: ' + error.error)
  //         }
  //     } catch (error) {
  //         console.error('Error adding product:', error)
  //         alert('Error adding product')
  //     }
  // })

  async function handleAddProduct(e) {
    e.preventDefault()
    const form = e.target
    const productData = {
      name: form.productName.value,
      sku: form.productSku.value,
      brand_id: parseInt(form.productBrand.value),
      package_size: form.productPackageSize.value,
      price: parseFloat(form.productPrice.value),
      type: form.productType.value,
      abv: parseFloat(form.productAbv.value) || 0,
      stock: parseInt(form.productStock.value),
    }
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(productData),
      })
      if (response.ok) {
        alert("Product added successfully!")
        setShowProductForm(false)
        loadProducts()
        loadDashboard()
      } else {
        const error = await response.json()
        alert("Error: " + error.error)
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  async function deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return
      try {
          const response = await fetch(`${API_BASE}/products/${id}`, {
              method: 'DELETE'
          })

          if (response.ok) {
              alert('Product deleted successfully!')
              loadProducts()
              loadDashboard()
          // } else {
          //     const error = await response.json()
          //     alert('Error: ' + error.error)
          }
      } catch (error) {
          console.error('Error deleteing product:', error)
      }
  }

  // Brand functions
  async function loadBrands() {
      try {
          const response = await fetch(`${API_BASE}/brands`)
          setBrands(await response.json())

          // const tableBody = document.querySelector('#brandsTable tbody')
          // tableBody.innerHTML = brands.map(brand => `
          //     <tr>
          //         <td>${brand.name}</td>
          //         <td>${brand.country}</td>
          //         <td>${brand.description}</td>
          //         <td>
          //             <button class="btn btn-danger" onclick="deleteBrand(${brand.id})">Delete</button>
          //         </td>
          //     </tr>
          // `).join('')
      } catch (error) {
          console.error('Error loading brands:', error)
      }
  }

  // function showAddBrandForm() {
  //     document.getElementById('addBrandForm').style.display = 'block';
  // }

  // function hideAddBrandForm() {
  //     document.getElementById('addBrandForm').style.display = 'none';
  //     document.getElementById('brandForm').reset();
  // }

  // document.getElementById('brandForm').addEventListener('submit', async (e) => {
  //     e.preventDefault()

  //     const brandData = {
  //         name:document.getElementById('brandName').value,
  //         country: document.getElementById('brandCountry').value,
  //         description: document.getElementById('brandDescription').value
  //     }

  //     try {
  //         const response = await fetch(`${API_BASE}/brands`, {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(brandData)
  //         })

  //         if (response.ok) {
  //             alert('Brand added successfully!')
  //             hideAddBrandForm()
  //             loadBrands()
  //             loadDashboard()
  //         } else {
  //             const error = await response.json()
  //             alert('Error: ' + error.error)
  //         }
  //     } catch (error) {
  //         console.error('Error adding brand', error)
  //         alert('Error adding brand')
  //     }
  // })

  async function handleAddBrand(e) {
    e.preventDefault()
    const form = e.target
    const brandData = {
      name: form.brandName.value,
      country: form.brandCountry.value,
      description: form.brandDescription.value,
    }
    try {
      const response = await fetch(`${API_BASE}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandData),
      })
      if (response.ok) {
        alert("Brand added successfully!")
        setShowBrandForm(false)
        loadBrands()
        loadDashboard()
      }
    } catch (error) {
      console.error("Error adding brand:", error)
    }
  }

  async function deleteBrand(id) {
    if (!confirm('Are you sure you want to delete this brand?')) return
      try {
          const response = await fetch(`${API_BASE}/brands/${id}`, {
              method: 'DELETE'
          });
          
          if (response.ok) {
              alert('Brand deleted successfully!');
              loadBrands();
              loadDashboard();
          // } else {
          //     const error = await response.json();
          //     alert('Error: ' + error.error);
          }
      } catch (error) {
          console.error('Error deleting brand:', error);
          // alert('Error deleting brand');
      }
  }

  // Stock management functions
  // async function loadStockManagement() {
  //     try {
  //         const response = await fetch(`${API_BASE}/products`);
  //         const products = await response.json();
          
  //         const tableBody = document.querySelector('#stockTable tbody');
  //         tableBody.innerHTML = products.map(product => `
  //             <tr>
  //                 <td>${product.name}</td>
  //                 <td>${product.brand?.name || 'N/A'}</td>
  //                 <td>${product.stock < 10 ? `<span class="low-stock">${product.stock}</span>` : product.stock}</td>
  //                 <td>$${product.price}</td>
  //                 <td class="stock-controls">
  //                     <input type="number" class="stock-input" id="stockInput${product.id}" placeholder="Qty" min="1">
  //                     <button class="btn btn-success" onclick="adjustStock(${product.id}, 'add')">Add</button>
  //                     <button class="btn btn-danger" onclick="adjustStock(${product.id}, 'subtract')">Remove</button>
  //                 </td>
  //             </tr>
  //         `).join('');
  //     } catch (error) {
  //         console.error('Error loading stock management:', error);
  //     }
  // }

  async function adjustStock(productId, action, amount) {
      // const amountInput = document.getElementById(`stockInput${productId}`);
      // const amount = parseInt(amountInput.value, 10);
      
      if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          return;
      }
      const adjustment = action === "subtract" ? -amount : amount

      try {
          const response = await fetch(`${API_BASE}/products/${productId}/adjust-stock`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  amount: adjustment,
              })
          });
          
          const result = await response.json();
          
          if (response.ok) {
              alert(`Stock ${action === "subtract" ? "removed" : "added"} successfully! New stock: ${result.new_stock}`);
              // amountInput.value = '';
              loadProducts();
              loadDashboard();
          } else {
              alert('Error: ' + result.error);
          }
      } catch (error) {
          console.error('Error adjusting stock:', error);
          alert('Error adjusting stock');
      }
  }

  // // Initialize dashboard on page load
  // window.onload = function() {
  //     loadDashboard()
  // }


  return (
    <div className="container">
      <div className="header">
        <h1>Beer Inventory System</h1>
        <div className="nav-tabs">
          {["dashboard", "products", "brands", "stock"].map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              >{tab[0].toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        <div className="tab-content">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div id="dashboard" className="tab-pane active">
              <h2>Inventory Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">Products: {summary.total_products}</div>
                <div className="stat-card">Brands: {summary.total_brands}</div>
                <div className="stat-card">Value: {summary.total_stock_value}</div>
                <div className="stat-card">Low Stock: {summary.low_stock_items}</div>
              </div>
              <h3>Low Stock Items</h3>
              <div className="table-container">
                <table id="lowStockTable">
                  <thead>
                    <tr>
                      <th>Product</th><th>Brand</th><th>Stock</th><th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.brand?.name || "N/A"}</td>
                        <td className="low-stock">{item.stock}</td>
                        <td> ${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          

          {/* Products */}
          {activeTab === "products" && (
            <div className="tab-content">
              <div id="products" className="tab-pane">
                <h2>Product Management</h2>
                <div className="form-group">
                  <button className="btn" onClick={() => setShowProductForm(!showProductForm)}>
                    {/* {showProductForm ? "Cancel" : "Add Product"} */}
                    Add New Product
                  </button>
                </div>
                {showProductForm && (
                <div id="addProductForm">
                  <h3>Add New Product</h3>
                  <form id="productForm" onSubmit={handleAddProduct}>
                    <div className="form-group">
                      <label>Product Name:</label>
                      <input id="productName" required />
                    </div>
                    <div className="form-group">
                      <label>SKU:</label>
                      <input id="productSku" required />
                    </div>
                    <div className="form-group">
                      <label>Brand:</label>
                      <select id="productBrand" required>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      </div>
                    <div className="form-group">
                      <label>Package Size:</label>
                      <input id="productPackageSize" />
                    </div>
                    <div className="form-group">
                      <label>Price:</label>
                      <input id="productPrice" type="number" step="0.01" required />
                    </div>
                    <div className="form-group">
                      <label>Type:</label>
                      <input id="productType" />
                    </div>
                    <div className="form-group">
                      <label>ABV:</label>
                      <input id="productAbv" type="number" step="0.1" />
                    </div>
                    <div className="form-group">
                      <label>Initial Stock:</label>
                      <input id="productStock" type="number" required />
                    </div>
                    <button className="btn" type="submit">Save Product</button>
                    <button className="btn btn-danger" type="button" onClick={() => setShowProductForm(!showProductForm)}>Cancel</button>
                  </form>
                </div>
                )}
                <table>
                  <thead>
                    <tr>
                      <th>Name</th><th>SKU</th><th>Brand</th><th>Stock</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.sku}</td>
                        <td>{p.brand?.name || "N/A"}</td>
                        <td className={p.stock < 10 ? "low-stock" : ""}>{p.stock}</td>
                        <td><button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Brands */}
          {activeTab === "brands" && (
          <div id="brands" className="tab-pane">
            <h2>Brand Management</h2>
            <div className="form-group">
              <button className="btn" onClick={() => setShowBrandForm(!showBrandForm)}>
                {/* {showBrandForm ? "Cancel" : "Add Brand"} */}
                Add New Brand
              </button>
            </div>
            {showBrandForm && (
            <div id="addBrandForm">
              <h3>Add New Brand</h3>
              <form id="brandForm" onSubmit={handleAddBrand}>
                <div className="form-group">
                  <label>Name:</label>
                  <input id="brandName" required />
                </div>
                <div className="form-group">
                  <label>Country:</label>
                  <input id="brandCountry" required />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <input id="brandDescription" type="text" placeholder="Brief description of the brand"/>
                </div>
                <button type="submit" className="btn">Save Brand</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowBrandForm(!showBrandForm)}>Cancel</button>
              </form>
            </div>
            )}
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
          </div>
          )}

          {/* Stock Management */}
          {activeTab === "stock" && (
            <div id="stock" className="tab-pane">
              <h2>Stock Management</h2>
              <div className="table-container">
                <table id="stockTable">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Current Stock</th>
                      <th>Price</th>
                      <th>Stock Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      let inputRef
                      return (
                        <tr key={p.id}>
                          <td>{p.name}</td>
                          <td>{p.brand?.name || "N/A"}</td>
                          <td className={p.stock < 10 ? "low-stock" : ""}>{p.stock}</td>
                          <td>${p.price}</td>
                          <td className="stock-controls">
                            <input type="number" className="stock-input" id="stockInputs${p.id}" placeholder="Qty" min="1" ref={(el) => (inputRef = el)}></input>
                            <button className="btn btn-success" onClick={async () => { await adjustStock(p.id, "add", parseInt(inputRef.value)) 
                              inputRef.value = ""}}>Add</button>
                            <button className="btn btn-danger" onClick={async () => {await adjustStock(p.id, "subtract", parseInt(inputRef.value))
                              inputRef.value = ""}}>Delete</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>


    // <div>
    //   <div className="header">
    //     <h1>Beer Inventory System</h1>
    //   </div>
    //   <div className="nav-tabs">
    //         <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
    //           onClick={() => showTab('dashboard')}
    //           >Dashboard</button>
    //         <button className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
    //           onClick={() => showTab('products')}
    //           >Products</button>
    //         <button className={`nav-tab ${activeTab === 'brands' ? 'active' : ''}`}
    //           onClick={() => showTab('brands')}
    //           >Brands</button>
    //         <button className={`nav-tab ${activeTab === 'stock' ? 'active' : ''}`}
    //           onClick={() => showTab('stock')}
    //           >Stock Management</button>
    //     </div>

    //     <div className="tab-content">
    //       {/* <!-- Dashboard Tab --> */}
    //       {activeTab === "dashboard" && (
    //         <div className="tab-pane active">
    //             <h2>Inventory Overview</h2>
    //             <div className="stats-grid" id="statsGrid">
    //                 {/* <!-- Stats will load here --> */}
    //             </div>

    //             <h3>Low Stock Items</h3>
    //             <div className="table-container">
    //                 <table id="lowStockTable">
    //                     <thead>
    //                         <tr>
    //                             <th>Product</th>
    //                             <th>Brand</th>
    //                             <th>Current Stock</th>
    //                             <th>Price</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {/* <!-- Low stock items will be loaded here --> */}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //       )}

    //       {/* <!-- Products Tab --> */}
    //       {activeTab === "products" && (
    //         <div className="tab-pane">
    //             <h2>Product Management</h2>
    //             <div className="form-group">
    //                 <button className="btn" 
    //                   // onClick="showAddProductForm()"
    //                   >Add New Product</button>
    //             </div>

    //             {/* <!-- Add Product Form --> */}
    //             <div id="addProductForm">
    //                 <h3>Add New Product</h3>
    //                 <form id="productForm">
    //                     <div className="form-group">
    //                         <label>Product Name:</label>
    //                         <input type="text" id="productName" required></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>SKU:</label>
    //                         <input type="text" id="productSku" required></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Brand:</label>
    //                         <select id="productBrand" required>
    //                             {/* <!-- Brands will be loaded here --> */}
    //                         </select>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Package Size:</label>
    //                         <input type="text" id="productPackageSize" placeholder="e.g., 12 Pack"></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Price:</label>
    //                         <input type="number" id="productPrice" step="0.01" required></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Type:</label>
    //                         <input type="text" id="productType" placeholder="e.g., Lager, Stout"></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>ABV (%):</label>
    //                         <input type="number" id="productAbv" step="0.1" placeholder="e.g., 5.0"></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Initial Stock:</label>
    //                         <input type="number" id="productStock" required></input>
    //                     </div>
    //                     <button type="submit" className="btn">Save Product</button>
    //                     <button type="button" className="btn btn-danger" 
    //                       // onClick="hideAddProductForm()"
    //                       >Cancel</button>
    //                 </form>
    //             </div>

    //             <div className="table-container">
    //                 <table id="productsTable">
    //                     <thead>
    //                         <tr>
    //                             <th>Product</th>
    //                             <th>SKU</th>
    //                             <th>Brand</th>
    //                             <th>Package</th>
    //                             <th>Price</th>
    //                             <th>Type</th>
    //                             <th>ABV</th>
    //                             <th>Stock</th>
    //                             <th>Actions</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {/* <!-- Products will load here --> */}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //       )}

    //       {/* <!-- Brands Tab --> */}
    //       {activeTab === "brands" && (
    //         <div className="tab-pane">
    //             <h2>Brand Management</h2>
    //             <div className="form-group">
    //                 <button className="btn" 
    //                   // onClick="showAddBrandForm()"
    //                   >Add New Brand</button>
    //             </div>
                
    //             {/* <!-- Add Brand Form --> */}
    //             <div id="addBrandForm">
    //                 <h3>Add New Brand</h3>
    //                 <form id="brandForm">
    //                     <div className="form-group">
    //                         <label>Brand Name:</label>
    //                         <input type="text" id="brandName" required></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Country:</label>
    //                         <input type="text" id="brandCountry" required></input>
    //                     </div>
    //                     <div className="form-group">
    //                         <label>Description:</label>
    //                         <input type="text" id="brandDescription" placeholder="Brief description of the brand"></input>
    //                     </div>
    //                     <button type="submit" className="btn">Save Brand</button>
    //                     <button type="button" className="btn btn-danger" 
    //                       // onClick="hideAddBrandForm()"
    //                       >Cancel</button>
    //                 </form>
    //             </div>
                
    //             <div className="table-container">
    //                 <table id="brandsTable">
    //                     <thead>
    //                         <tr>
    //                             <th>Brand Name</th>
    //                             <th>Country</th>
    //                             <th>Description</th>
    //                             <th>Actions</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {/* <!-- Brands will be loaded here --> */}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //       )}
            
    //       {/* <!-- Stock Management Tab --> */}
    //       {activeTab === "stock" && (
    //         <div className="tab-pane">
    //             <h2>Stock Management</h2>
    //             <div className="table-container">
    //                 <table id="stockTable">
    //                     <thead>
    //                         <tr>
    //                             <th>Product</th>
    //                             <th>Brand</th>
    //                             <th>Current Stock</th>
    //                             <th>Price</th>
    //                             <th>Stock Actions</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {/* <!-- Stock management will be loaded here --> */}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //       )}
    //     </div>
    // </div>
  )
}

export default Home