<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ClothTrack | Inventory Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<!-- ============================================================ LOGIN ============================================================ -->
<section class="auth-screen" id="authScreen">
  <div class="auth-background-glow auth-glow-1"></div>
  <div class="auth-background-glow auth-glow-2"></div>
  <div class="auth-card">
    <div class="auth-brand">
      <div class="auth-logo">CT</div>
      <h1>ClothTrack</h1>
      <p class="auth-subtitle">Inventory Management System</p>
    </div>
    <form id="loginForm" class="auth-form">
      <div class="auth-field">
        <label for="username">Username</label>
        <input id="username" type="text" placeholder="Enter username" required />
      </div>
      <div class="auth-field">
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Enter password" required />
      </div>
      <div id="loginError" class="auth-error hidden"></div>
      <button type="submit" class="auth-btn" id="loginBtn">Login</button>
    </form>
    <div class="auth-demo">
      <span>Demo account</span>
      <strong>admin / 123456</strong>
    </div>
  </div>
</section>

<!-- ============================================================ MAIN APP ============================================================ -->
<div class="app hidden" id="appShell">
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">CT</div>
      <div>
        <h2>ClothTrack</h2>
        <p>Inventory Control Center</p>
      </div>
    </div>
    <nav class="menu" id="menu">
      <button class="menu-item active" data-tab="dashboard">Dashboard</button>
      <button class="menu-item" data-tab="products">Products</button>
      <button class="menu-item" data-tab="categories">Categories</button>
      <button class="menu-item" data-tab="suppliers">Suppliers</button>
      <button class="menu-item" data-tab="warehouses">Warehouses</button>
      <button class="menu-item" data-tab="stockin">Stock In</button>
      <button class="menu-item" data-tab="stockout">Stock Out</button>
      <button class="menu-item" data-tab="inventory">Inventory</button>
      <button class="menu-item" data-tab="reports">Reports</button>
      <button class="menu-item" data-tab="users">Users</button>
    </nav>
    <div class="sidebar-card">
      <h3>Operational Summary</h3>
      <p>Centralized fashion inventory monitoring for men, women, and kids collections with stock control, discount tracking, and reporting.</p>
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <div>
        <span class="small-label">Inventory Dashboard</span>
        <h1>Warehouse & Product Performance Overview</h1>
        <p class="top-desc">Monitor stock health, discount items, warehouse distribution, category performance, and replenishment priorities in one place.</p>
      </div>
      <div class="topbar-right">
        <button class="primary-btn" id="globalActionBtn">+ Add Product</button>
        <div class="user-profile">
          <div class="avatar" id="userAvatar">AD</div>
          <div>
            <h4 id="currentUserName">Admin User</h4>
            <span id="currentUserRole">System Administrator</span>
          </div>
        </div>
        <button class="logout-btn" id="logoutBtn">Logout</button>
      </div>
    </header>

    <!-- DASHBOARD -->
    <section class="tab-content active" id="dashboard">
      <section class="stats-grid">
        <div class="stat-card"><div class="stat-top"><p>Total Products</p><span class="stat-icon">📦</span></div><h2 id="totalProducts">0</h2><span>All tracked fashion products</span></div>
        <div class="stat-card"><div class="stat-top"><p>Total Stock</p><span class="stat-icon">🏷️</span></div><h2 id="totalStock">0</h2><span>Available inventory units</span></div>
        <div class="stat-card warning"><div class="stat-top"><p>Low Stock Items</p><span class="stat-icon">⚠️</span></div><h2 id="lowStockCount">0</h2><span>Need replenishment soon</span></div>
        <div class="stat-card success"><div class="stat-top"><p>Total Categories</p><span class="stat-icon">🧩</span></div><h2 id="categoryCount">0</h2><span>Active product groups</span></div>
        <div class="stat-card info"><div class="stat-top"><p>Total Suppliers</p><span class="stat-icon">🚚</span></div><h2 id="supplierCount">0</h2><span>Current supply partners</span></div>
        <div class="stat-card purple"><div class="stat-top"><p>Warehouses</p><span class="stat-icon">🏬</span></div><h2>3</h2><span>Main, North, South</span></div>
      </section>
      <section class="dashboard-grid">
        <section class="panel">
          <div class="panel-header"><div><h2>Inventory Overview</h2><p>High-level business status for daily operations</p></div></div>
          <div class="overview-grid">
            <div class="overview-card"><div class="overview-label">Highest Stock Product</div><h3 id="topProductName">-</h3><p id="topProductMeta">-</p></div>
            <div class="overview-card"><div class="overview-label">Lowest Stock Product</div><h3 id="criticalProductName">-</h3><p id="criticalProductMeta">-</p></div>
            <div class="overview-card"><div class="overview-label">Inventory Value</div><h3 id="inventoryValue">0</h3><p>Based on import price × current stock</p></div>
            <div class="overview-card"><div class="overview-label">Potential Sales Value</div><h3 id="saleValue">0</h3><p>Based on sale price × current stock</p></div>
          </div>
        </section>
        <aside class="right-panel">
          <section class="panel mini-panel">
            <div class="panel-header small"><div><h2>Quick Actions</h2><p>Common operational tasks</p></div></div>
            <div class="quick-actions">
              <button class="action-btn" id="quickAddBtn">Add New Product</button>
              <button class="action-btn" id="quickStockInBtn">Create Stock In Note</button>
              <button class="action-btn" id="quickStockOutBtn">Create Stock Out Note</button>
              <button class="action-btn" id="quickReportBtn">Review Inventory Report</button>
            </div>
          </section>
          <section class="panel mini-panel">
            <div class="panel-header small"><div><h2>Low Stock Alert</h2><p>Immediate replenishment priorities</p></div></div>
            <div id="dashboardLowStockList" class="low-stock-list"></div>
          </section>
        </aside>
      </section>
      <section class="bottom-grid">
        <section class="panel"><div class="panel-header"><div><h2>Warehouse Distribution</h2><p>Current stock allocation by warehouse</p></div></div><div id="warehouseSummaryCards" class="warehouse-summary-cards"></div></section>
        <section class="panel"><div class="panel-header"><div><h2>Category Performance</h2><p>Number of products by category</p></div></div><div id="categorySummaryCards" class="category-summary-cards"></div></section>
      </section>
    </section>

    <!-- PRODUCTS -->
    <section class="tab-content" id="products">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Product Management</h2><p>Manage product information, stock health, discounts, supplier, and warehouse allocation</p></div>
          <div class="panel-actions">
            <button class="secondary-btn" id="addProductBtn">Add Product</button>
            <button class="secondary-btn" id="exportInventoryBtn">Export JSON</button>
          </div>
        </div>
        <div class="filters">
          <input type="text" id="searchInput" placeholder="Search by product name, barcode, category..." />
          <select id="categoryFilter"><option value="all">All Categories</option></select>
          <select id="sizeFilter"><option value="all">All Sizes</option></select>
          <select id="supplierFilter"><option value="all">All Suppliers</option></select>
          <select id="stockFilter">
            <option value="all">All Stock Status</option>
            <option value="good">High Stock</option>
            <option value="medium">Medium Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <div class="filters extra-filters">
          <select id="segmentFilter">
            <option value="all">All Segments</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
          <select id="warehouseFilter">
            <option value="all">All Warehouses</option>
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="North Warehouse">North Warehouse</option>
            <option value="South Warehouse">South Warehouse</option>
          </select>
          <select id="discountFilter">
            <option value="all">All Discount Status</option>
            <option value="discounted">Discounted Only</option>
            <option value="regular">Regular Price Only</option>
          </select>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product ID</th><th>Image</th><th>Barcode</th><th>Product Name</th>
                <th>Variant</th><th>Category</th><th>Size</th><th>Unit</th>
                <th>Supplier</th><th>Warehouse</th><th>Import Price</th><th>Sale Price</th>
                <th>Wholesale</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody id="inventoryTableBody"></tbody>
          </table>
        </div>
      </section>
    </section>

    <!-- CATEGORIES -->
    <section class="tab-content" id="categories">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Category Management</h2><p>Create and organize product categories</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="addCategoryBtn">Add Category</button></div>
        </div>
        <div class="simple-table" id="categoriesTable"></div>
      </section>
    </section>

    <!-- SUPPLIERS -->
    <section class="tab-content" id="suppliers">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Supplier Management</h2><p>Track supplier information and relationships</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="addSupplierBtn">Add Supplier</button></div>
        </div>
        <div class="simple-table" id="suppliersTable"></div>
      </section>
    </section>

    <!-- WAREHOUSES -->
    <section class="tab-content" id="warehouses">
      <section class="panel">
        <div class="panel-header"><div><h2>Warehouse Management</h2><p>Manage stock distribution and operational status</p></div></div>
        <div class="simple-table" id="warehousesTable"></div>
      </section>
    </section>

    <!-- STOCK IN -->
    <section class="tab-content" id="stockin">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Stock In Management</h2><p>Track product imports from suppliers into warehouses</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="createStockInBtn">Create Stock In</button></div>
        </div>
        <div class="simple-table" id="stockInTable"></div>
      </section>
    </section>

    <!-- STOCK OUT -->
    <section class="tab-content" id="stockout">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Stock Out Management</h2><p>Track outgoing goods for store fulfillment</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="createStockOutBtn">Create Stock Out</button></div>
        </div>
        <div class="simple-table" id="stockOutTable"></div>
      </section>
    </section>

    <!-- INVENTORY -->
    <section class="tab-content" id="inventory">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Current Inventory Tracking</h2><p>Review warehouse stock totals and inventory condition</p></div>
          <div class="panel-actions">
            <button class="secondary-btn" id="exportInventoryBtn2">Export Inventory</button>
            <button class="secondary-btn" id="markLowStockBtn">Mark Low Stock</button>
          </div>
        </div>
        <div id="inventorySummary" class="report-list"></div>
      </section>
    </section>

    <!-- REPORTS -->
    <section class="tab-content" id="reports">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Inventory Reports</h2><p>Business summaries for monitoring stock and replenishment planning</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="generateReportBtn">Generate Report</button></div>
        </div>
        <div class="report-list" id="reportSummaryList"></div>
      </section>
    </section>

    <!-- USERS -->
    <section class="tab-content" id="users">
      <section class="panel">
        <div class="panel-header">
          <div><h2>User Management</h2><p>Manage system access and operational roles</p></div>
          <div class="panel-actions"><button class="secondary-btn" id="addUserBtn">Add User</button></div>
        </div>
        <div class="simple-table" id="usersTable"></div>
      </section>
    </section>
  </main>
</div>

<!-- ============================================================ PRODUCT MODAL ============================================================ -->
<div id="productModal" class="modal-overlay hidden">
  <div class="modal-box modal-large">
    <div class="modal-header">
      <h2 id="productModalTitle">Add Product</h2>
      <button class="modal-close" id="productModalClose">&times;</button>
    </div>
    <form id="productForm" class="modal-form">
      <input type="hidden" id="editingProductId" />
      <div class="modal-grid-2">
        <div class="form-field"><label>Product ID *</label><input type="text" id="fId" placeholder="P019" required /></div>
        <div class="form-field"><label>Barcode *</label><input type="text" id="fBarcode" placeholder="893001000019" required /></div>
        <div class="form-field modal-col-2"><label>Product Name *</label><input type="text" id="fName" placeholder="Product name" required /></div>
        <div class="form-field"><label>Variant</label><input type="text" id="fVariant" placeholder="Red, M, etc." /></div>
        <div class="form-field">
          <label>Category *</label>
          <select id="fCategory">
            <option value="Polo">Polo</option>
            <option value="Shirt">Shirt</option>
            <option value="Dress">Dress</option>
            <option value="Set">Set</option>
            <option value="Kids Outerwear">Kids Outerwear</option>
            <option value="Kids Set">Kids Set</option>
          </select>
        </div>
        <div class="form-field">
          <label>Segment *</label>
          <select id="fSegment">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div class="form-field"><label>Size</label><input type="text" id="fSize" placeholder="S, M, L, XL, 6Y..." /></div>
        <div class="form-field">
          <label>Unit</label>
          <select id="fUnit">
            <option value="Piece">Piece</option>
            <option value="Set">Set</option>
          </select>
        </div>
        <div class="form-field">
          <label>Supplier</label>
          <select id="fSupplier">
            <option value="Yody Fashion">Yody Fashion</option>
            <option value="Cafe Fashion">Cafe Fashion</option>
            <option value="Yody Women">Yody Women</option>
            <option value="Yody Kids">Yody Kids</option>
          </select>
        </div>
        <div class="form-field">
          <label>Warehouse</label>
          <select id="fWarehouse">
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="North Warehouse">North Warehouse</option>
            <option value="South Warehouse">South Warehouse</option>
          </select>
        </div>
        <div class="form-field"><label>Import Price (VND)</label><input type="number" id="fImportPrice" min="0" value="0" /></div>
        <div class="form-field"><label>Original Price (VND)</label><input type="number" id="fOriginalPrice" min="0" value="0" /></div>
        <div class="form-field"><label>Sale Price (VND)</label><input type="number" id="fSalePrice" min="0" value="0" /></div>
        <div class="form-field"><label>Wholesale Price (VND)</label><input type="number" id="fWholesalePrice" min="0" value="0" /></div>
        <div class="form-field"><label>Discount %</label><input type="number" id="fDiscount" min="0" max="100" value="0" /></div>
        <div class="form-field"><label>Stock Quantity</label><input type="number" id="fStock" min="0" value="0" /></div>
        <div class="form-field"><label>Image Path</label><input type="text" id="fImage" placeholder="images/p019.png" /></div>
        <div class="form-field"><label>Color Options (comma separated)</label><input type="text" id="fColors" placeholder="Red, Blue, Black" /></div>
        <div class="form-field modal-col-2"><label>Note</label><input type="text" id="fNote" placeholder="Short product note" /></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn" id="productModalCancel">Cancel</button>
        <button type="submit" class="primary-btn modal-submit-btn" id="productModalSubmit">Save Product</button>
      </div>
    </form>
  </div>
</div>

<!-- ============================================================ STOCK IN MODAL ============================================================ -->
<div id="stockInModal" class="modal-overlay hidden">
  <div class="modal-box modal-small">
    <div class="modal-header">
      <h2>Stock In</h2>
      <button class="modal-close" id="stockInModalClose">&times;</button>
    </div>
    <form id="stockInForm" class="modal-form">
      <div class="form-field"><label>Product ID *</label><input type="text" id="siProductId" placeholder="P001" required /></div>
      <div class="form-field"><label>Quantity *</label><input type="number" id="siQty" min="1" value="10" required /></div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn" id="stockInModalCancel">Cancel</button>
        <button type="submit" class="primary-btn modal-submit-btn">Confirm Stock In</button>
      </div>
    </form>
  </div>
</div>

<!-- ============================================================ STOCK OUT MODAL ============================================================ -->
<div id="stockOutModal" class="modal-overlay hidden">
  <div class="modal-box modal-small">
    <div class="modal-header">
      <h2>Stock Out</h2>
      <button class="modal-close" id="stockOutModalClose">&times;</button>
    </div>
    <form id="stockOutForm" class="modal-form">
      <div class="form-field"><label>Product ID *</label><input type="text" id="soProductId" placeholder="P001" required /></div>
      <div class="form-field"><label>Quantity *</label><input type="number" id="soQty" min="1" value="5" required /></div>
      <div class="form-field"><label>Purpose</label><input type="text" id="soPurpose" value="Store allocation" /></div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn" id="stockOutModalCancel">Cancel</button>
        <button type="submit" class="primary-btn modal-submit-btn">Confirm Stock Out</button>
      </div>
    </form>
  </div>
</div>

<!-- ============================================================ SIMPLE MODAL (category/supplier/user) ============================================================ -->
<div id="simpleModal" class="modal-overlay hidden">
  <div class="modal-box modal-small">
    <div class="modal-header">
      <h2 id="simpleModalTitle">Add</h2>
      <button class="modal-close" id="simpleModalClose">&times;</button>
    </div>
    <form id="simpleModalForm" class="modal-form">
      <div id="simpleModalFields"></div>
      <div class="modal-footer">
        <button type="button" class="secondary-btn" id="simpleModalCancel">Cancel</button>
        <button type="submit" class="primary-btn modal-submit-btn">Save</button>
      </div>
    </form>
  </div>
</div>

<!-- TOAST NOTIFICATION -->
<div id="toast" class="toast hidden"></div>

<script src="script.js"></script>
</body>
</html>
