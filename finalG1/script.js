/* ============================================================
   ClothTrack — PHP / MySQL Edition
   All data operations use fetch() to the PHP API
   ============================================================ */

let products = [];

const extraFilters = { segment: 'all', warehouse: 'all', discount: 'all' };

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

async function initAuth() {
  try {
    const res = await api('api/auth.php?action=check');
    if (res.authenticated) {
      showApp(res.name, res.role);
      await loadAndRender();
    } else {
      showLoginScreen();
    }
  } catch {
    showLoginScreen();
  }
}

function showLoginScreen() {
  el('authScreen').classList.remove('hidden');
  el('appShell').classList.add('hidden');
}

function showApp(name, role) {
  el('authScreen').classList.add('hidden');
  el('appShell').classList.remove('hidden');
  el('currentUserName').textContent = name || 'User';
  el('currentUserRole').textContent = capitalize(role || 'staff');
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  el('userAvatar').textContent = initials;
  bindMenu();
  bindButtons();
}

async function loadAndRender() {
  showTableLoading();
  products = await api('api/products.php');
  populateFilters();
  renderAll();
  setActiveTab('dashboard');
}

/* ============================================================
   AUTH
   ============================================================ */
el('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = el('username').value.trim();
  const password = el('password').value;
  const btn = el('loginBtn');
  const errEl = el('loginError');

  errEl.classList.add('hidden');
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  try {
    const res = await fetch('api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showApp(data.name, data.role);
      await loadAndRender();
    } else {
      errEl.textContent = data.error || 'Invalid credentials';
      errEl.classList.remove('hidden');
    }
  } catch {
    errEl.textContent = 'Server error. Please try again.';
    errEl.classList.remove('hidden');
  } finally {
    btn.textContent = 'Login';
    btn.disabled = false;
  }
});

el('logoutBtn').addEventListener('click', async () => {
  await fetch('api/auth.php?action=logout', { method: 'POST' });
  products = [];
  showLoginScreen();
  el('loginForm').reset();
});

/* ============================================================
   MENU & TABS
   ============================================================ */
function bindMenu() {
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('click', () => setActiveTab(item.dataset.tab));
  });
}

function setActiveTab(tabId) {
  document.querySelectorAll('.menu-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.toggle('active', tab.id === tabId);
  });
  const labels = {
    dashboard: '+ Add Product', products: '+ Add Product',
    categories: '+ Add Category', suppliers: '+ Add Supplier',
    warehouses: '+ Edit Warehouse', stockin: '+ Create Stock In',
    stockout: '+ Create Stock Out', inventory: '+ Check Inventory',
    reports: '+ Generate Report', users: '+ Add User',
  };
  const gab = el('globalActionBtn');
  if (gab) gab.textContent = labels[tabId] || '+ Add Product';

  const tabLoaders = {
    stockin:    renderStockInTable,
    stockout:   renderStockOutTable,
    categories: renderCategoriesTable,
    suppliers:  renderSuppliersTable,
    warehouses: renderWarehousesTable,
    users:      renderUsersTable,
    inventory:  () => renderInventorySummary(getFilteredProducts()),
    reports:    () => renderReportSummary(getFilteredProducts()),
  };
  if (tabLoaders[tabId]) tabLoaders[tabId]();
}

function getActiveTabId() {
  const active = document.querySelector('.tab-content.active');
  return active ? active.id : 'dashboard';
}

/* ============================================================
   BUTTONS
   ============================================================ */
function bindButtons() {
  el('globalActionBtn')?.addEventListener('click', handleGlobalAction);
  el('addProductBtn')?.addEventListener('click', openAddProductModal);
  el('exportInventoryBtn')?.addEventListener('click', exportProductsAsJson);
  el('exportInventoryBtn2')?.addEventListener('click', exportProductsAsJson);
  el('markLowStockBtn')?.addEventListener('click', focusLowStockProducts);
  el('generateReportBtn')?.addEventListener('click', () => setActiveTab('reports'));
  el('quickAddBtn')?.addEventListener('click', openAddProductModal);
  el('quickStockInBtn')?.addEventListener('click', openStockInModal);
  el('quickStockOutBtn')?.addEventListener('click', openStockOutModal);
  el('quickReportBtn')?.addEventListener('click', () => setActiveTab('reports'));
  el('createStockInBtn')?.addEventListener('click', openStockInModal);
  el('createStockOutBtn')?.addEventListener('click', openStockOutModal);
  el('addCategoryBtn')?.addEventListener('click', openAddCategoryModal);
  el('addSupplierBtn')?.addEventListener('click', openAddSupplierModal);
  el('addUserBtn')?.addEventListener('click', openAddUserModal);

  el('searchInput')?.addEventListener('input', renderAll);
  el('categoryFilter')?.addEventListener('change', renderAll);
  el('sizeFilter')?.addEventListener('change', renderAll);
  el('supplierFilter')?.addEventListener('change', renderAll);
  el('stockFilter')?.addEventListener('change', renderAll);
  el('segmentFilter')?.addEventListener('change', (e) => { extraFilters.segment = e.target.value; renderAll(); });
  el('warehouseFilter')?.addEventListener('change', (e) => { extraFilters.warehouse = e.target.value; renderAll(); });
  el('discountFilter')?.addEventListener('change', (e) => { extraFilters.discount = e.target.value; renderAll(); });
}

function handleGlobalAction() {
  const tab = getActiveTabId();
  if (tab === 'stockin')  { openStockInModal(); return; }
  if (tab === 'stockout') { openStockOutModal(); return; }
  if (tab === 'categories') { openAddCategoryModal(); return; }
  if (tab === 'suppliers')  { openAddSupplierModal(); return; }
  if (tab === 'users')      { openAddUserModal(); return; }
  openAddProductModal();
}

/* ============================================================
   FILTERS
   ============================================================ */
function populateFilters() {
  setSelectOptions(el('categoryFilter'), 'All Categories', uniqueValues(products, 'category'));
  setSelectOptions(el('sizeFilter'), 'All Sizes', uniqueValues(products, 'size'));
  setSelectOptions(el('supplierFilter'), 'All Suppliers', uniqueValues(products, 'supplier'));
}

function setSelectOptions(selectEl, firstLabel, values) {
  if (!selectEl) return;
  const current = selectEl.value || 'all';
  selectEl.innerHTML = `<option value="all">${firstLabel}</option>`;
  values.forEach((v) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = v;
    selectEl.appendChild(o);
  });
  selectEl.value = values.includes(current) ? current : 'all';
}

function uniqueValues(list, key) {
  return [...new Set(list.map((item) => item[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

/* ============================================================
   FILTERING
   ============================================================ */
function getFilteredProducts() {
  const search    = (el('searchInput')?.value || '').toLowerCase().trim();
  const catVal    = el('categoryFilter')?.value || 'all';
  const sizeVal   = el('sizeFilter')?.value || 'all';
  const supVal    = el('supplierFilter')?.value || 'all';
  const stockVal  = el('stockFilter')?.value || 'all';

  return products.filter((p) => {
    const status     = getStockStatus(p.stock);
    const discounted = isDiscounted(p);
    const haystack   = [p.id, p.barcode, p.productName, p.variant, p.category, p.segment, p.supplier, p.warehouse].join(' ').toLowerCase();

    return (
      (!search || haystack.includes(search)) &&
      (catVal   === 'all' || p.category  === catVal) &&
      (sizeVal  === 'all' || p.size      === sizeVal) &&
      (supVal   === 'all' || p.supplier  === supVal) &&
      (stockVal === 'all' || status.key  === stockVal) &&
      (extraFilters.segment   === 'all' || p.segment   === extraFilters.segment) &&
      (extraFilters.warehouse === 'all' || p.warehouse === extraFilters.warehouse) &&
      (extraFilters.discount  === 'all' ||
        (extraFilters.discount === 'discounted' && discounted) ||
        (extraFilters.discount === 'regular' && !discounted))
    );
  });
}

/* ============================================================
   RENDER ALL
   ============================================================ */
function renderAll() {
  const filtered = getFilteredProducts();
  renderTable(filtered);
  updateDashboardStats(filtered);
  renderOverviewCards(filtered);
  renderDashboardLowStock(filtered);
  renderWarehouseSummary(filtered);
  renderCategorySummary(filtered);
  renderInventorySummary(filtered);
  renderReportSummary(filtered);
  renderCategoriesTable();
  renderSuppliersTable();
  renderWarehousesTable();
  renderStockInTable();
  renderStockOutTable();
  renderUsersTable();
}

/* ============================================================
   PRODUCT TABLE
   ============================================================ */
function renderTable(data) {
  const tbody = el('inventoryTableBody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="16" style="text-align:center;padding:30px;color:#64748b;">No matching products found.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((p) => {
    const status     = getStockStatus(p.stock);
    const discounted = isDiscounted(p);
    return `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.image || 'images/no-image.jpg'}" alt="${esc(p.productName)}" class="product-thumb" onerror="this.src='images/no-image.jpg'" /></td>
        <td>${p.barcode}</td>
        <td class="product-name">
          ${esc(p.productName)}
          ${discounted ? `<div style="margin-top:6px;"><span class="pill blue">-${p.discountPercent}% OFF</span></div>` : ''}
        </td>
        <td>${esc(p.variant || '-')}</td>
        <td>${esc(p.category)}</td>
        <td>${esc(p.size)}</td>
        <td>${esc(p.unit)}</td>
        <td>${esc(p.supplier)}</td>
        <td>${esc(p.warehouse)}</td>
        <td>${fmtNum(p.importPrice)}</td>
        <td>
          ${fmtNum(p.salePrice)}
          ${discounted ? `<div style="font-size:12px;color:#94a3b8;text-decoration:line-through;margin-top:4px;">${fmtNum(p.originalPrice)}</div>` : ''}
        </td>
        <td>${fmtNum(p.wholesalePrice)}</td>
        <td class="stock-number">${p.stock}</td>
        <td>
          <span class="status-badge ${status.className}">${status.text}</span>
          <div style="margin-top:6px;font-size:12px;color:#64748b;">${esc(p.segment)}</div>
        </td>
        <td>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="secondary-btn edit-row-btn" data-id="${p.id}">Edit</button>
            <button class="secondary-btn delete-row-btn" data-id="${p.id}" style="background:#fee2e2;color:#b91c1c;">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.edit-row-btn').forEach((btn) => btn.addEventListener('click', () => openEditProductModal(btn.dataset.id)));
  tbody.querySelectorAll('.delete-row-btn').forEach((btn) => btn.addEventListener('click', () => deleteProduct(btn.dataset.id)));
}

function showTableLoading() {
  const tbody = el('inventoryTableBody');
  if (tbody) tbody.innerHTML = `<tr class="loading-row"><td colspan="16">Loading products...</td></tr>`;
}

/* ============================================================
   DASHBOARD WIDGETS
   ============================================================ */
function updateDashboardStats(data) {
  setText('totalProducts', data.length);
  setText('totalStock', data.reduce((s, p) => s + p.stock, 0));
  setText('lowStockCount', data.filter((p) => p.stock < 20).length);
  setText('categoryCount', new Set(data.map((p) => p.category)).size);
  setText('supplierCount', new Set(data.map((p) => p.supplier)).size);
}

function renderOverviewCards(data) {
  if (!data.length) {
    ['topProductName','topProductMeta','criticalProductName','criticalProductMeta'].forEach((id) => setText(id, '-'));
    setText('inventoryValue', '0'); setText('saleValue', '0');
    return;
  }
  const byStock = [...data].sort((a, b) => b.stock - a.stock);
  const high = byStock[0]; const low = byStock[byStock.length - 1];
  setText('topProductName', high.productName);
  setText('topProductMeta', `${high.variant} • ${high.warehouse} • Stock: ${high.stock}`);
  setText('criticalProductName', low.productName);
  setText('criticalProductMeta', `${low.variant} • ${low.warehouse} • Stock: ${low.stock}`);
  setText('inventoryValue', fmtNum(data.reduce((s, p) => s + p.importPrice * p.stock, 0)));
  setText('saleValue', fmtNum(data.reduce((s, p) => s + p.salePrice * p.stock, 0)));
}

function renderDashboardLowStock(data) {
  const container = el('dashboardLowStockList');
  if (!container) return;
  const low = data.filter((p) => p.stock < 20).sort((a, b) => a.stock - b.stock).slice(0, 6);
  if (!low.length) { container.innerHTML = '<p class="empty-note">No urgent low stock items.</p>'; return; }
  container.innerHTML = low.map((p) => `
    <div class="low-stock-item">
      <h4>${esc(p.productName)}</h4>
      <p>Segment: ${p.segment}<br>Variant: ${esc(p.variant)}<br>Warehouse: ${p.warehouse}<br>Remaining: <strong>${p.stock}</strong>${isDiscounted(p) ? `<br>Discount: <strong>${p.discountPercent}%</strong>` : ''}</p>
    </div>`).join('');
}

function renderWarehouseSummary(data) {
  const container = el('warehouseSummaryCards');
  if (!container) return;
  const warehouses = ['Main Warehouse', 'North Warehouse', 'South Warehouse'];
  container.innerHTML = warehouses.map((w) => {
    const items = data.filter((p) => p.warehouse === w);
    const stock = items.reduce((s, p) => s + p.stock, 0);
    return `<div class="summary-row"><span class="label">${w}<br><small style="color:#94a3b8;">${items.length} products • ${items.filter(isDiscounted).length} discounted</small></span><span class="value">${stock}</span></div>`;
  }).join('');
}

function renderCategorySummary(data) {
  const container = el('categorySummaryCards');
  if (!container) return;
  container.innerHTML = uniqueValues(data, 'category').map((cat) => {
    const items = data.filter((p) => p.category === cat);
    return `<div class="summary-row"><span class="label">${cat}<br><small style="color:#94a3b8;">${items.filter(isDiscounted).length} discounted</small></span><span class="value">${items.length} products</span></div>`;
  }).join('');
}

function renderInventorySummary(data) {
  const container = el('inventorySummary');
  if (!container) return;
  const warehouses = ['Main Warehouse', 'North Warehouse', 'South Warehouse'];
  container.innerHTML = warehouses.map((w) => {
    const stock = data.filter((p) => p.warehouse === w).reduce((s, p) => s + p.stock, 0);
    return `<div class="report-item"><span>${w} Stock</span><strong>${stock}</strong></div>`;
  }).join('') + `
    <div class="report-item"><span>Discounted Products</span><strong>${data.filter(isDiscounted).length}</strong></div>
    <div class="report-item"><span>Low Stock Products</span><strong>${data.filter((p) => p.stock < 20).length}</strong></div>`;
}

function renderReportSummary(data) {
  const container = el('reportSummaryList');
  if (!container) return;
  const men   = data.filter((p) => p.segment === 'Men').length;
  const women = data.filter((p) => p.segment === 'Women').length;
  const kids  = data.filter((p) => p.segment === 'Kids').length;
  const importVal = data.reduce((s, p) => s + p.importPrice * p.stock, 0);
  const saleVal   = data.reduce((s, p) => s + p.salePrice  * p.stock, 0);
  const savings   = data.reduce((s, p) => s + Math.max(0, (p.originalPrice || p.salePrice) - p.salePrice) * p.stock, 0);
  container.innerHTML = [
    ['Total Men Products', men],
    ['Total Women Products', women],
    ['Total Kids Products', kids],
    ['Discounted Products', data.filter(isDiscounted).length],
    ['Total Import Inventory Value', fmtNum(importVal) + ' VND'],
    ['Total Sale Inventory Value', fmtNum(saleVal) + ' VND'],
    ['Total Customer Savings Value', fmtNum(savings) + ' VND'],
  ].map(([label, val]) => `<div class="report-item"><span>${label}</span><strong>${val}</strong></div>`).join('');
}

/* ============================================================
   SIMPLE TABLES (categories / suppliers / warehouses / stockin / stockout / users)
   ============================================================ */
function renderCategoriesTable() {
  const section = el('categoriesTable');
  if (!section) return;
  const cats = uniqueValues(products, 'category');
  const descMap = { Polo: 'Men polo shirts', Shirt: 'Formal and casual shirts', Dress: "Women's dresses", Set: 'Coordinated outfit sets', 'Kids Outerwear': 'Kids jackets and vests', 'Kids Set': 'Kids matching sets' };
  section.innerHTML = `
    <div class="simple-table-header"><span>Category Name</span><span>Description</span><span>Product Count</span><span>Status</span></div>
    ${cats.map((cat) => `
      <div class="simple-table-row">
        <span>${cat}</span>
        <span>${descMap[cat] || 'Product category'}</span>
        <span>${products.filter((p) => p.category === cat).length}</span>
        <span class="pill green">Active</span>
      </div>`).join('')}`;
}

function renderSuppliersTable() {
  const section = el('suppliersTable');
  if (!section) return;
  const suppliers = uniqueValues(products, 'supplier');
  section.innerHTML = `
    <div class="simple-table-header"><span>Supplier</span><span>Phone</span><span>Email</span><span>Products</span></div>
    ${suppliers.map((sup, i) => `
      <div class="simple-table-row">
        <span>${sup}</span>
        <span>090${i + 1} ${String(111 + i * 111).padStart(3, '0')} ${String(222 + i * 111).padStart(3, '0')}</span>
        <span>${sup.toLowerCase().replace(/\s+/g, '')}@demo.com</span>
        <span>${products.filter((p) => p.supplier === sup).length}</span>
      </div>`).join('')}`;
}

function renderWarehousesTable() {
  const section = el('warehousesTable');
  if (!section) return;
  const wh = [
    { name: 'Main Warehouse',  location: 'District 1', manager: 'Inventory Lead' },
    { name: 'North Warehouse', location: 'District 9', manager: 'North Team Lead' },
    { name: 'South Warehouse', location: 'Binh Tan',   manager: 'South Team Lead' },
  ];
  section.innerHTML = `
    <div class="simple-table-header"><span>Warehouse</span><span>Location</span><span>Manager</span><span>Status</span></div>
    ${wh.map((w) => {
      const stock = products.filter((p) => p.warehouse === w.name).reduce((s, p) => s + p.stock, 0);
      const cls   = stock < 80 ? 'yellow' : 'green';
      const lbl   = stock < 80 ? 'Needs Review' : 'Active';
      return `<div class="simple-table-row"><span>${w.name}</span><span>${w.location}</span><span>${w.manager}</span><span class="pill ${cls}">${lbl}</span></div>`;
    }).join('')}`;
}

async function renderStockInTable() {
  const section = el('stockInTable');
  if (!section) return;
  try {
    const rows = await api('api/stock_in.php');
    if (!rows.length) {
      section.innerHTML = '<div style="padding:16px 18px;color:#64748b;">No stock-in records yet.</div>'; return;
    }
    section.innerHTML = `
      <div class="simple-table-header"><span>Note ID</span><span>Date</span><span>Product</span><span>Warehouse</span><span>Qty</span><span>Status</span></div>
      ${rows.map((r) => `
        <div class="simple-table-row" style="grid-template-columns:repeat(6,1fr);">
          <span>${r.note_id}</span>
          <span>${r.date}</span>
          <span>${esc(r.product_name || r.product_id)}</span>
          <span>${r.warehouse}</span>
          <span>${r.quantity}</span>
          <span class="pill green">Completed</span>
        </div>`).join('')}`;
  } catch {
    section.innerHTML = '<div style="padding:16px;color:#64748b;">Failed to load stock-in records.</div>';
  }
}

async function renderStockOutTable() {
  const section = el('stockOutTable');
  if (!section) return;
  try {
    const rows = await api('api/stock_out.php');
    if (!rows.length) {
      section.innerHTML = '<div style="padding:16px 18px;color:#64748b;">No stock-out records yet.</div>'; return;
    }
    section.innerHTML = `
      <div class="simple-table-header"><span>Note ID</span><span>Date</span><span>Product</span><span>Warehouse</span><span>Qty</span><span>Status</span></div>
      ${rows.map((r) => `
        <div class="simple-table-row" style="grid-template-columns:repeat(6,1fr);">
          <span>${r.note_id}</span>
          <span>${r.date}</span>
          <span>${esc(r.product_name || r.product_id)}</span>
          <span>${r.warehouse}</span>
          <span>${r.quantity}</span>
          <span class="pill blue">${capitalize(r.status)}</span>
        </div>`).join('')}`;
  } catch {
    section.innerHTML = '<div style="padding:16px;color:#64748b;">Failed to load stock-out records.</div>';
  }
}

async function renderUsersTable() {
  const section = el('usersTable');
  if (!section) return;
  try {
    const rows = await api('api/users.php');
    section.innerHTML = `
      <div class="simple-table-header"><span>Name</span><span>Role</span><span>Email</span><span>Username</span><span>Status</span></div>
      ${rows.map((u) => `
        <div class="simple-table-row" style="grid-template-columns:repeat(5,1fr);">
          <span>${esc(u.name)}</span>
          <span>${capitalize(u.role)}</span>
          <span>${esc(u.email || '-')}</span>
          <span>${esc(u.username)}</span>
          <span class="pill ${u.status === 'active' ? 'green' : 'yellow'}">${capitalize(u.status)}</span>
        </div>`).join('')}`;
  } catch {
    section.innerHTML = '<div style="padding:16px;color:#64748b;">Failed to load users.</div>';
  }
}

/* ============================================================
   PRODUCT MODAL — ADD
   ============================================================ */
function openAddProductModal() {
  el('productModalTitle').textContent = 'Add Product';
  el('editingProductId').value = '';
  el('productForm').reset();
  el('fId').value = generateNextProductId();
  el('fBarcode').value = String(Date.now()).slice(-12);
  el('fId').disabled = false;
  openModal('productModal');
}

/* ============================================================
   PRODUCT MODAL — EDIT
   ============================================================ */
function openEditProductModal(id) {
  const p = products.find((item) => item.id === id);
  if (!p) { showToast('Product not found', 'error'); return; }

  el('productModalTitle').textContent = 'Edit Product';
  el('editingProductId').value = p.id;
  el('fId').value = p.id;
  el('fId').disabled = true;
  el('fBarcode').value = p.barcode;
  el('fName').value = p.productName;
  el('fVariant').value = p.variant || '';
  el('fCategory').value = p.category;
  el('fSegment').value = p.segment;
  el('fSize').value = p.size || '';
  el('fUnit').value = p.unit || 'Piece';
  el('fSupplier').value = p.supplier;
  el('fWarehouse').value = p.warehouse;
  el('fImportPrice').value = p.importPrice;
  el('fOriginalPrice').value = p.originalPrice;
  el('fSalePrice').value = p.salePrice;
  el('fWholesalePrice').value = p.wholesalePrice;
  el('fDiscount').value = p.discountPercent;
  el('fStock').value = p.stock;
  el('fImage').value = p.image || '';
  el('fColors').value = (p.colorOptions || []).join(', ');
  el('fNote').value = p.note || '';
  openModal('productModal');
}

el('productModalClose').addEventListener('click', () => closeModal('productModal'));
el('productModalCancel').addEventListener('click', () => closeModal('productModal'));

el('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const editingId = el('editingProductId').value;
  const isEdit = Boolean(editingId);

  const payload = {
    id:              el('fId').value.trim().toUpperCase(),
    barcode:         el('fBarcode').value.trim(),
    productName:     el('fName').value.trim(),
    variant:         el('fVariant').value.trim(),
    category:        el('fCategory').value,
    segment:         el('fSegment').value,
    size:            el('fSize').value.trim(),
    unit:            el('fUnit').value,
    supplier:        el('fSupplier').value,
    warehouse:       el('fWarehouse').value,
    importPrice:     Number(el('fImportPrice').value),
    originalPrice:   Number(el('fOriginalPrice').value),
    salePrice:       Number(el('fSalePrice').value),
    wholesalePrice:  Number(el('fWholesalePrice').value),
    discountPercent: Number(el('fDiscount').value),
    stock:           Number(el('fStock').value),
    image:           el('fImage').value.trim(),
    colorOptions:    el('fColors').value.split(',').map((s) => s.trim()).filter(Boolean),
    note:            el('fNote').value.trim(),
  };

  const submitBtn = el('productModalSubmit');
  submitBtn.textContent = 'Saving...';
  submitBtn.disabled = true;

  try {
    let res, data;
    if (isEdit) {
      res  = await fetch(`api/products.php?id=${encodeURIComponent(editingId)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      data = await res.json();
      if (res.ok) {
        const idx = products.findIndex((p) => p.id === editingId);
        if (idx !== -1) products[idx] = data;
        showToast(`Product "${data.productName}" updated successfully`, 'success');
      } else {
        showToast(data.error || 'Failed to update product', 'error'); return;
      }
    } else {
      res  = await fetch('api/products.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      data = await res.json();
      if (res.ok) {
        products.push(data);
        showToast(`Product "${data.productName}" added successfully`, 'success');
      } else {
        showToast(data.error || 'Failed to add product', 'error'); return;
      }
    }
    closeModal('productModal');
    populateFilters();
    renderAll();
    if (!isEdit) setActiveTab('products');
  } catch {
    showToast('Server error. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Save Product';
    submitBtn.disabled = false;
  }
});

/* ============================================================
   DELETE PRODUCT
   ============================================================ */
async function deleteProduct(id) {
  const p = products.find((item) => item.id === id);
  if (!p) return;
  if (!confirm(`Delete "${p.productName}" (${p.id})?`)) return;

  try {
    const res  = await fetch(`api/products.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      products = products.filter((item) => item.id !== id);
      populateFilters();
      renderAll();
      showToast(data.message || 'Product deleted', 'success');
    } else {
      showToast(data.error || 'Failed to delete', 'error');
    }
  } catch {
    showToast('Server error', 'error');
  }
}

/* ============================================================
   STOCK IN MODAL
   ============================================================ */
function openStockInModal() {
  el('stockInForm').reset();
  openModal('stockInModal');
}

el('stockInModalClose').addEventListener('click', () => closeModal('stockInModal'));
el('stockInModalCancel').addEventListener('click', () => closeModal('stockInModal'));

el('stockInForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const productId = el('siProductId').value.trim().toUpperCase();
  const quantity  = Number(el('siQty').value);

  try {
    const res  = await fetch('api/stock_in.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) });
    const data = await res.json();
    if (res.ok) {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx !== -1) products[idx].stock = data.newStock;
      showToast(`Stock-in completed. ${data.productName} now has ${data.newStock} units.`, 'success');
      closeModal('stockInModal');
      renderAll();
      await renderStockInTable();
    } else {
      showToast(data.error || 'Stock-in failed', 'error');
    }
  } catch {
    showToast('Server error', 'error');
  }
});

/* ============================================================
   STOCK OUT MODAL
   ============================================================ */
function openStockOutModal() {
  el('stockOutForm').reset();
  openModal('stockOutModal');
}

el('stockOutModalClose').addEventListener('click', () => closeModal('stockOutModal'));
el('stockOutModalCancel').addEventListener('click', () => closeModal('stockOutModal'));

el('stockOutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const productId = el('soProductId').value.trim().toUpperCase();
  const quantity  = Number(el('soQty').value);
  const purpose   = el('soPurpose').value.trim() || 'Store allocation';

  try {
    const res  = await fetch('api/stock_out.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity, purpose }) });
    const data = await res.json();
    if (res.ok) {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx !== -1) products[idx].stock = data.newStock;
      showToast(`Stock-out completed. ${data.productName} now has ${data.newStock} units.`, 'success');
      closeModal('stockOutModal');
      renderAll();
      await renderStockOutTable();
    } else {
      showToast(data.error || 'Stock-out failed', 'error');
    }
  } catch {
    showToast('Server error', 'error');
  }
});

/* ============================================================
   SIMPLE MODAL (category / supplier / user)
   ============================================================ */
let simpleModalHandler = null;

function openSimpleModal(title, fieldsHtml, onSubmit) {
  el('simpleModalTitle').textContent = title;
  el('simpleModalFields').innerHTML = fieldsHtml;
  simpleModalHandler = onSubmit;
  openModal('simpleModal');
}

el('simpleModalClose').addEventListener('click', () => closeModal('simpleModal'));
el('simpleModalCancel').addEventListener('click', () => closeModal('simpleModal'));

el('simpleModalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (simpleModalHandler) await simpleModalHandler();
});

function openAddCategoryModal() {
  openSimpleModal('Add Category', `
    <div class="form-field"><label>Category Name *</label><input type="text" id="smCatName" required /></div>
    <div class="form-field" style="margin-top:14px;"><label>Description</label><input type="text" id="smCatDesc" /></div>
  `, async () => {
    const name = el('smCatName')?.value.trim();
    const desc = el('smCatDesc')?.value.trim();
    if (!name) return;
    const res = await fetch('api/categories.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc }) });
    const data = await res.json();
    if (res.ok) { showToast(`Category "${data.name}" added`, 'success'); closeModal('simpleModal'); }
    else showToast(data.error || 'Failed', 'error');
  });
}

function openAddSupplierModal() {
  openSimpleModal('Add Supplier', `
    <div class="form-field"><label>Supplier Name *</label><input type="text" id="smSupName" required /></div>
    <div class="form-field" style="margin-top:14px;"><label>Phone</label><input type="text" id="smSupPhone" /></div>
    <div class="form-field" style="margin-top:14px;"><label>Email</label><input type="email" id="smSupEmail" /></div>
  `, async () => {
    const name  = el('smSupName')?.value.trim();
    const phone = el('smSupPhone')?.value.trim();
    const email = el('smSupEmail')?.value.trim();
    if (!name) return;
    const res = await fetch('api/suppliers.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, email }) });
    const data = await res.json();
    if (res.ok) { showToast(`Supplier "${data.name}" added`, 'success'); closeModal('simpleModal'); }
    else showToast(data.error || 'Failed', 'error');
  });
}

function openAddUserModal() {
  openSimpleModal('Add User', `
    <div class="form-field"><label>Username *</label><input type="text" id="smUName" required /></div>
    <div class="form-field" style="margin-top:14px;"><label>Full Name *</label><input type="text" id="smUFullName" required /></div>
    <div class="form-field" style="margin-top:14px;"><label>Password *</label><input type="password" id="smUPass" required /></div>
    <div class="form-field" style="margin-top:14px;"><label>Email</label><input type="email" id="smUEmail" /></div>
    <div class="form-field" style="margin-top:14px;"><label>Role</label><select id="smURole"><option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div>
  `, async () => {
    const username = el('smUName')?.value.trim();
    const name     = el('smUFullName')?.value.trim();
    const password = el('smUPass')?.value;
    const email    = el('smUEmail')?.value.trim();
    const role     = el('smURole')?.value;
    if (!username || !name || !password) return;
    const res = await fetch('api/users.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, name, password, email, role }) });
    const data = await res.json();
    if (res.ok) { showToast(`User "${data.name}" added`, 'success'); closeModal('simpleModal'); await renderUsersTable(); }
    else showToast(data.error || 'Failed', 'error');
  });
}

/* ============================================================
   EXPORT / UTILITY ACTIONS
   ============================================================ */
function exportProductsAsJson() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'clothtrack-products.json'; a.click();
  URL.revokeObjectURL(url);
}

function focusLowStockProducts() {
  const sf = el('stockFilter');
  if (sf) sf.value = 'low';
  extraFilters.discount = 'all';
  const df = el('discountFilter');
  if (df) df.value = 'all';
  renderAll();
  setActiveTab('products');
}

/* ============================================================
   HELPERS
   ============================================================ */
function getStockStatus(stock) {
  if (stock <= 0)   return { text: 'Out of Stock', className: 'status-low', key: 'out' };
  if (stock < 20)   return { text: 'Low Stock',    className: 'status-low', key: 'low' };
  if (stock < 50)   return { text: 'Medium Stock', className: 'status-medium', key: 'medium' };
  return               { text: 'High Stock',     className: 'status-good', key: 'good' };
}

function isDiscounted(p) {
  return Number(p.discountPercent || 0) > 0 || Number(p.salePrice) < Number(p.originalPrice || p.salePrice);
}

function generateNextProductId() {
  const max = products.reduce((m, p) => {
    const match = String(p.id).match(/^P(\d+)$/i);
    return Math.max(m, match ? Number(match[1]) : 0);
  }, 0);
  return `P${String(max + 1).padStart(3, '0')}`;
}

async function api(url, options) {
  const res  = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

function el(id) { return document.getElementById(id); }

function setText(id, value) {
  const elem = el(id);
  if (elem) elem.textContent = value;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmtNum(v) { return Number(v || 0).toLocaleString('en-US'); }

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

/* ============================================================
   MODAL OPEN / CLOSE
   ============================================================ */
function openModal(id) {
  const m = el(id);
  if (!m) return;
  m.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  m.addEventListener('click', (e) => { if (e.target === m) closeModal(id); }, { once: true });
}

function closeModal(id) {
  const m = el(id);
  if (!m) return;
  m.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer = null;

function showToast(message, type = 'success') {
  const t = el('toast');
  if (!t) return;
  t.textContent = message;
  t.className = `toast toast-${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.add('hidden'); }, 3500);
}
