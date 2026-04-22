const STORAGE_KEY = "clothtrack_inventory_v2";
const SESSION_KEY = "clothtrack_session";
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "123456";


const defaultProducts = [
 {
   id: "P001",
   image: "images/p001.png",
   barcode: "893001000001",
   productName: "Men Honeycomb Knit Polo Shirt",
   variant: "Red",
   category: "Polo",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Yody Fashion",
   warehouse: "Main Warehouse",
   importPrice: 120000,
   salePrice: 169000,
   originalPrice: 199000,
   wholesalePrice: 145000,
   stock: 48,
   discountPercent: 16,
   colorOptions: ["Red", "Mustard", "Blue", "Black"],
   note: "Short sleeve polo"
 },
 {
   id: "P002",
   image: "images/p002.png",
   barcode: "893001000002",
   productName: "Men Striped Yody Polo",
   variant: "Black / White",
   category: "Polo",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Yody Fashion",
   warehouse: "North Warehouse",
   importPrice: 130000,
   salePrice: 184500,
   originalPrice: 369000,
   wholesalePrice: 160000,
   stock: 22,
   discountPercent: 50,
   colorOptions: ["Black", "Blue"],
   note: "Striped polo design"
 },
 {
   id: "P003",
   image: "images/p003.png",
   barcode: "893001000003",
   productName: "Men Short Sleeve Contrast Collar Polo",
   variant: "White / Navy",
   category: "Polo",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Yody Fashion",
   warehouse: "Main Warehouse",
   importPrice: 135000,
   salePrice: 199000,
   originalPrice: 349000,
   wholesalePrice: 175000,
   stock: 35,
   discountPercent: 43,
   colorOptions: ["White", "Navy", "Black", "Beige"],
   note: "Contrast collar detail"
 },
 {
   id: "P004",
   image: "images/p004.png",
   barcode: "893001000004",
   productName: "Men Long Sleeve Office Shirt",
   variant: "White",
   category: "Shirt",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Cafe Fashion",
   warehouse: "South Warehouse",
   importPrice: 290000,
   salePrice: 499000,
   originalPrice: 499000,
   wholesalePrice: 360000,
   stock: 18,
   discountPercent: 0,
   colorOptions: ["White", "Blue", "Navy"],
   note: "Formal office shirt"
 },
 {
   id: "P005",
    image: "images/p005.png",
   barcode: "893001000005",
   productName: "Men Short Sleeve Plaid Shirt",
   variant: "Blue Plaid",
   category: "Shirt",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Cafe Fashion",
   warehouse: "North Warehouse",
   importPrice: 270000,
   salePrice: 469000,
   originalPrice: 469000,
   wholesalePrice: 330000,
   stock: 26,
   discountPercent: 0,
   colorOptions: ["Blue Plaid", "Grey Plaid"],
   note: "Plaid short sleeve shirt"
 },
 {
   id: "P006",
    image: "images/p006.png",
   barcode: "893001000006",
   productName: "Men Denim Pocket Shirt",
   variant: "Denim Blue",
   category: "Shirt",
   segment: "Men",
   size: "L",
   unit: "Piece",
   supplier: "Cafe Fashion",
   warehouse: "Main Warehouse",
   importPrice: 275000,
   salePrice: 469000,
   originalPrice: 469000,
   wholesalePrice: 340000,
   stock: 14,
   discountPercent: 0,
   colorOptions: ["Denim Blue"],
   note: "Chest pocket design"
 },
 {
   id: "P007",
    image: "images/p007.png",
   barcode: "893001000007",
   productName: "Luxury Party Dress For Women",
   variant: "Blush Pink",
   category: "Dress",
   segment: "Women",
   size: "M",
   unit: "Piece",
   supplier: "Yody Women",
   warehouse: "Main Warehouse",
   importPrice: 390000,
   salePrice: 649000,
   originalPrice: 649000,
   wholesalePrice: 470000,
   stock: 16,
   discountPercent: 0,
   colorOptions: ["Beige", "White", "Black"],
   note: "Elegant party dress"
 },
 {
   id: "P008",
    image: "images/p008.png",
   barcode: "893001000008",
   productName: "Casual Midi Dress Collection",
   variant: "Light Purple",
   category: "Dress",
   segment: "Women",
   size: "M",
   unit: "Piece",
   supplier: "Yody Women",
   warehouse: "South Warehouse",
   importPrice: 540000,
   salePrice: 899000,
   originalPrice: 899000,
   wholesalePrice: 650000,
   stock: 9,
   discountPercent: 0,
   colorOptions: ["Lavender"],
   note: "Premium midi collection"
 },
 {
   id: "P009",
    image: "images/p009.png",
   barcode: "893001000009",
   productName: "Vintage Collar Waist Dress",
   variant: "Soft Pink",
   category: "Dress",
   segment: "Women",
   size: "M",
   unit: "Piece",
   supplier: "Yody Women",
   warehouse: "North Warehouse",
   importPrice: 120000,
   salePrice: 199000,
   originalPrice: 199000,
   wholesalePrice: 150000,
   stock: 37,
   discountPercent: 0,
   colorOptions: ["Pink", "White"],
   note: "Waist tie layered dress"
 },
 {
   id: "P010",
    image: "images/p0010.png",
   barcode: "893001000010",
   productName: "Women Number 99 Tee Shorts Set",
   variant: "Navy",
   category: "Set",
   segment: "Women",
   size: "M",
   unit: "Set",
   supplier: "Yody Women",
   warehouse: "Main Warehouse",
   importPrice: 290000,
   salePrice: 499000,
   originalPrice: 499000,
   wholesalePrice: 360000,
   stock: 27,
   discountPercent: 0,
   colorOptions: ["Purple", "Cream"],
   note: "Printed 99 matching set"
 },
 {
   id: "P011",
    image: "images/p0011.png",
   barcode: "893001000011",
   productName: "Women Raglan Lounge Set",
   variant: "Brown / Cream",
   category: "Set",
   segment: "Women",
   size: "M",
   unit: "Set",
   supplier: "Yody Women",
   warehouse: "South Warehouse",
   importPrice: 160000,
   salePrice: 249500,
   originalPrice: 499000,
   wholesalePrice: 210000,
   stock: 12,
   discountPercent: 50,
   colorOptions: ["Brown"],
   note: "Raglan casual set"
 },
 {
   id: "P012",
    image: "images/p0012.png",
   barcode: "893001000012",
   productName: "Elegant Women Textured Set",
   variant: "Black",
   category: "Set",
   segment: "Women",
   size: "M",
   unit: "Set",
   supplier: "Yody Women",
   warehouse: "North Warehouse",
   importPrice: 215000,
   salePrice: 349000,
   originalPrice: 349000,
   wholesalePrice: 260000,
   stock: 21,
   discountPercent: 0,
   colorOptions: ["Black", "Beige"],
   note: "Formal short set"
 },
 {
   id: "P013",
   image: "images/p0013.png",
   barcode: "893001000013",
   productName: "Kids Standing Collar Puffer Vest",
   variant: "Cream",
   category: "Kids Outerwear",
   segment: "Kids",
   size: "6Y",
   unit: "Piece",
   supplier: "Yody Kids",
   warehouse: "Main Warehouse",
   importPrice: 240000,
   salePrice: 399000,
   originalPrice: 399000,
   wholesalePrice: 300000,
   stock: 24,
   discountPercent: 0,
   colorOptions: ["Cream", "Navy"],
   note: "Standing collar vest"
 },
 {
   id: "P014",
    image: "images/p0014.png",
   barcode: "893001000014",
   productName: "Kids Smart Windbreaker",
   variant: "Orange Red",
   category: "Kids Outerwear",
   segment: "Kids",
   size: "7Y",
   unit: "Piece",
   supplier: "Yody Kids",
   warehouse: "North Warehouse",
   importPrice: 155000,
   salePrice: 249500,
   originalPrice: 499000,
   wholesalePrice: 210000,
   stock: 33,
   discountPercent: 50,
   colorOptions: ["Orange", "Grey", "Navy", "Pink", "Black"],
   note: "Smart windbreaker"
 },
 {
   id: "P015",
    image: "images/p0015.png",
   barcode: "893001000015",
   productName: "Kids Hooded Fleece Jacket",
   variant: "Light Grey",
   category: "Kids Outerwear",
   segment: "Kids",
   size: "7Y",
   unit: "Piece",
   supplier: "Yody Kids",
   warehouse: "South Warehouse",
   importPrice: 155000,
   salePrice: 249500,
   originalPrice: 499000,
   wholesalePrice: 210000,
   stock: 11,
   discountPercent: 50,
   colorOptions: ["Grey", "Black"],
   note: "Warm fleece lining"
 },
 {
   id: "P016",
    image: "images/p0016.png",
   barcode: "893001000016",
   productName: "Little Girl Berry Set",
   variant: "White / Orange",
   category: "Kids Set",
   segment: "Kids",
   size: "5Y",
   unit: "Set",
   supplier: "Yody Kids",
   warehouse: "Main Warehouse",
   importPrice: 180000,
   salePrice: 299000,
   originalPrice: 299000,
   wholesalePrice: 230000,
   stock: 28,
   discountPercent: 0,
   colorOptions: ["Orange", "Pink"],
   note: "Sleeveless berry set"
 },
 {
   id: "P017",
    image: "images/p0017.png",
   barcode: "893001000017",
   productName: "Little Boy Sundaze Set",
   variant: "White / Navy",
   category: "Kids Set",
   segment: "Kids",
   size: "6Y",
   unit: "Set",
   supplier: "Yody Kids",
   warehouse: "North Warehouse",
   importPrice: 180000,
   salePrice: 299000,
   originalPrice: 299000,
   wholesalePrice: 230000,
   stock: 19,
   discountPercent: 0,
   colorOptions: ["Cream", "Yellow", "Green"],
   note: "Printed tee shorts set"
 },
 {
   id: "P018",
    image: "images/p0018.png",
   barcode: "893001000018",
   productName: "Little Girl Strawberry Set",
   variant: "Yellow",
   category: "Kids Set",
   segment: "Kids",
   size: "5Y",
   unit: "Set",
   supplier: "Yody Kids",
   warehouse: "South Warehouse",
   importPrice: 180000,
   salePrice: 299000,
   originalPrice: 299000,
   wholesalePrice: 230000,
   stock: 29,
   discountPercent: 0,
   colorOptions: ["Cream", "Lilac", "Peach"],
   note: "Strawberry print set"
 }
];


let products = loadProducts();


const inventoryTableBody = document.getElementById("inventoryTableBody");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sizeFilter = document.getElementById("sizeFilter");
const supplierFilter = document.getElementById("supplierFilter");
const stockFilter = document.getElementById("stockFilter");

/* 👉 AUTH (đoạn bạn thêm) */
const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");
const currentUserName = document.getElementById("currentUserName");
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === "admin" && password === "123456") {
    authScreen.classList.add("hidden");
    appShell.classList.remove("hidden");
  } else {
    alert("Sai tài khoản hoặc mật khẩu");
  }
});

logoutBtn.addEventListener("click", function () {
  // Xóa session (nếu bạn có dùng)
  localStorage.removeItem("clothtrack_session");

  // Hiện lại login
  authScreen.classList.remove("hidden");

  // Ẩn app
  appShell.classList.add("hidden");
});

const totalProductsEl = document.getElementById("totalProducts");
const totalStockEl = document.getElementById("totalStock");
const lowStockCountEl = document.getElementById("lowStockCount");
const categoryCountEl = document.getElementById("categoryCount");
const supplierCountEl = document.getElementById("supplierCount");


const dashboardLowStockList = document.getElementById("dashboardLowStockList");
const inventorySummary = document.getElementById("inventorySummary");
const reportSummaryList = document.getElementById("reportSummaryList");
const warehouseSummaryCards = document.getElementById("warehouseSummaryCards");
const categorySummaryCards = document.getElementById("categorySummaryCards");


const topProductName = document.getElementById("topProductName");
const topProductMeta = document.getElementById("topProductMeta");
const criticalProductName = document.getElementById("criticalProductName");
const criticalProductMeta = document.getElementById("criticalProductMeta");
const inventoryValueEl = document.getElementById("inventoryValue");
const saleValueEl = document.getElementById("saleValue");


const menuItems = document.querySelectorAll(".menu-item");
const tabContents = document.querySelectorAll(".tab-content");
const globalActionBtn = document.getElementById("globalActionBtn");


let extraFilters = {
 segment: "all",
 warehouse: "all",
 discount: "all"
};


bootstrap();


function bootstrap() {
 ensureActionColumn();
 injectAdvancedFilters();
 bindMenu();
 bindButtons();
 populateFilters();
 renderAll();
 setActiveTab("dashboard");
}


function loadProducts() {
 try {
   const stored = localStorage.getItem(STORAGE_KEY);
   if (!stored) return structuredClone(defaultProducts);
   const parsed = JSON.parse(stored);
   return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(defaultProducts);
 } catch (error) {
   console.error("Failed to load products from localStorage:", error);
   return structuredClone(defaultProducts);
 }
}


function saveProducts() {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}


function formatCurrency(value) {
 return `${Number(value || 0).toLocaleString("en-US")} VND`;
}


function formatCompactCurrency(value) {
 return Number(value || 0).toLocaleString("en-US");
}


function getStockStatus(stock) {
 if (stock <= 0) return { text: "Out of Stock", className: "status-low", key: "out" };
 if (stock < 20) return { text: "Low Stock", className: "status-low", key: "low" };
 if (stock < 50) return { text: "Medium Stock", className: "status-medium", key: "medium" };
 return { text: "High Stock", className: "status-good", key: "good" };
}


function isDiscounted(product) {
 return Number(product.discountPercent || 0) > 0 || Number(product.salePrice) < Number(product.originalPrice || product.salePrice);
}


function ensureActionColumn() {
 const tableHeadRow = document.querySelector("table thead tr");
 if (!tableHeadRow) return;


 const existing = [...tableHeadRow.children].find((th) => th.dataset.role === "actions");
 if (!existing) {
   const th = document.createElement("th");
   th.textContent = "Actions";
   th.dataset.role = "actions";
   tableHeadRow.appendChild(th);
 }
}


function injectAdvancedFilters() {
 const filtersWrap = document.querySelector(".filters");
 if (!filtersWrap || document.getElementById("segmentFilter")) return;


 const segmentSelect = document.createElement("select");
 segmentSelect.id = "segmentFilter";
 segmentSelect.innerHTML = `
   <option value="all">All Segments</option>
   <option value="Men">Men</option>
   <option value="Women">Women</option>
   <option value="Kids">Kids</option>
 `;


 const warehouseSelect = document.createElement("select");
 warehouseSelect.id = "warehouseFilter";
 warehouseSelect.innerHTML = `
   <option value="all">All Warehouses</option>
   <option value="Main Warehouse">Main Warehouse</option>
   <option value="North Warehouse">North Warehouse</option>
   <option value="South Warehouse">South Warehouse</option>
 `;


 const discountSelect = document.createElement("select");
 discountSelect.id = "discountFilter";
 discountSelect.innerHTML = `
   <option value="all">All Discount Status</option>
   <option value="discounted">Discounted Only</option>
   <option value="regular">Regular Price Only</option>
 `;


 filtersWrap.appendChild(segmentSelect);
 filtersWrap.appendChild(warehouseSelect);
 filtersWrap.appendChild(discountSelect);


 segmentSelect.addEventListener("change", (e) => {
   extraFilters.segment = e.target.value;
   renderAll();
 });


 warehouseSelect.addEventListener("change", (e) => {
   extraFilters.warehouse = e.target.value;
   renderAll();
 });


 discountSelect.addEventListener("change", (e) => {
   extraFilters.discount = e.target.value;
   renderAll();
 });
}


function bindMenu() {
 menuItems.forEach((item) => {
   item.addEventListener("click", () => setActiveTab(item.dataset.tab));
 });
}


function bindButtons() {
 if (searchInput) searchInput.addEventListener("input", renderAll);
 if (categoryFilter) categoryFilter.addEventListener("change", renderAll);
 if (sizeFilter) sizeFilter.addEventListener("change", renderAll);
 if (supplierFilter) supplierFilter.addEventListener("change", renderAll);
 if (stockFilter) stockFilter.addEventListener("change", renderAll);


 if (globalActionBtn) {
   globalActionBtn.addEventListener("click", () => {
     const activeTab = getActiveTabId();
     if (activeTab === "categories") {
       alert("Category management can be derived automatically from products in this version.");
       return;
     }
     if (activeTab === "suppliers") {
       alert("Supplier management is currently product-driven in this version.");
       return;
     }
     if (activeTab === "warehouses") {
       alert("Warehouse allocation is managed per product through Edit Product.");
       return;
     }
     createProduct();
   });
 }


 document.querySelectorAll(".secondary-btn").forEach((button) => {
   const text = button.textContent.trim().toLowerCase();


   if (text.includes("add product")) {
     button.addEventListener("click", createProduct);
   } else if (text.includes("edit product")) {
     button.addEventListener("click", editProductByIdPrompt);
   } else if (text.includes("delete product")) {
     button.addEventListener("click", deleteProductByIdPrompt);
   } else if (text.includes("export inventory list")) {
     button.addEventListener("click", exportProductsAsJson);
   } else if (text.includes("generate report")) {
     button.addEventListener("click", showQuickReport);
   } else if (text.includes("mark low stock")) {
     button.addEventListener("click", focusLowStockProducts);
   } else if (text.includes("review inventory report")) {
     button.addEventListener("click", () => setActiveTab("reports"));
   } else if (text.includes("check inventory")) {
     button.addEventListener("click", () => setActiveTab("inventory"));
   } else if (text.includes("view purchase history")) {
     button.addEventListener("click", () => alert("Purchase history module can be added next. Current version focuses on product inventory management."));
   } else if (text.includes("transfer stock")) {
     button.addEventListener("click", transferStockPrompt);
   } else if (text.includes("create stock in note")) {
     button.addEventListener("click", stockInPrompt);
   } else if (text.includes("create stock out note")) {
     button.addEventListener("click", stockOutPrompt);
   }
 });


 document.querySelectorAll(".action-btn").forEach((button) => {
   const text = button.textContent.trim().toLowerCase();
   if (text.includes("add new product")) button.addEventListener("click", createProduct);
   if (text.includes("create stock in")) button.addEventListener("click", stockInPrompt);
   if (text.includes("create stock out")) button.addEventListener("click", stockOutPrompt);
   if (text.includes("review inventory report")) button.addEventListener("click", () => setActiveTab("reports"));
 });
}


function populateFilters() {
 const categories = uniqueValues(products, "category");
 const sizes = uniqueValues(products, "size");
 const suppliers = uniqueValues(products, "supplier");


 setSelectOptions(categoryFilter, "All Categories", categories);
 setSelectOptions(sizeFilter, "All Sizes", sizes);
 setSelectOptions(supplierFilter, "All Suppliers", suppliers);


 if (stockFilter && stockFilter.options.length <= 4) {
   stockFilter.innerHTML = `
     <option value="all">All Stock Status</option>
     <option value="good">High Stock</option>
     <option value="medium">Medium Stock</option>
     <option value="low">Low Stock</option>
     <option value="out">Out of Stock</option>
   `;
 }
}


function setSelectOptions(selectEl, firstLabel, values) {
 if (!selectEl) return;
 const currentValue = selectEl.value || "all";
 selectEl.innerHTML = `<option value="all">${firstLabel}</option>`;
 values.forEach((value) => {
   const option = document.createElement("option");
   option.value = value;
   option.textContent = value;
   selectEl.appendChild(option);
 });
 selectEl.value = values.includes(currentValue) ? currentValue : "all";
}


function uniqueValues(list, key) {
 return [...new Set(list.map((item) => item[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}


function getFilteredProducts() {
 const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";
 const categoryValue = categoryFilter ? categoryFilter.value : "all";
 const sizeValue = sizeFilter ? sizeFilter.value : "all";
 const supplierValue = supplierFilter ? supplierFilter.value : "all";
 const stockValue = stockFilter ? stockFilter.value : "all";


 return products.filter((product) => {
   const status = getStockStatus(product.stock);
   const discounted = isDiscounted(product);
   const haystack = [
     product.id,
     product.images,
     product.barcode,
     product.productName,
     product.variant,
     product.category,
     product.segment,
     product.supplier,
     product.warehouse
   ]
     .join(" ")
     .toLowerCase();


   const matchSearch = !searchValue || haystack.includes(searchValue);
   const matchCategory = categoryValue === "all" || product.category === categoryValue;
   const matchSize = sizeValue === "all" || product.size === sizeValue;
   const matchSupplier = supplierValue === "all" || product.supplier === supplierValue;
   const matchStock = stockValue === "all" || status.key === stockValue;
   const matchSegment = extraFilters.segment === "all" || product.segment === extraFilters.segment;
   const matchWarehouse = extraFilters.warehouse === "all" || product.warehouse === extraFilters.warehouse;
   const matchDiscount =
     extraFilters.discount === "all" ||
     (extraFilters.discount === "discounted" && discounted) ||
     (extraFilters.discount === "regular" && !discounted);


   return matchSearch && matchCategory && matchSize && matchSupplier && matchStock && matchSegment && matchWarehouse && matchDiscount;
 });
}


function renderTable(data) {
 if (!inventoryTableBody) return;


 if (!data.length) {
   inventoryTableBody.innerHTML = `
     <tr>
       <td colspan="16" style="text-align:center; padding:30px; color:#64748b;">
         No matching products found.
       </td>
     </tr>
   `;
   return;
 }


 inventoryTableBody.innerHTML = data
   .map((product) => {
     const status = getStockStatus(product.stock);
     const discounted = isDiscounted(product);


     return `
       <tr>
 <td>${product.id}</td>
 <td>
   <img
     src="${product.image || 'images/no-image.jpg'}"
     alt="${product.productName}"
     class="product-thumb"
   />
 </td>
 <td>${product.barcode}</td>
 <td class="product-name">


           ${product.productName}
           ${discounted ? `<div style="margin-top:6px;"><span class="pill blue">-${product.discountPercent}% OFF</span></div>` : ""}
         </td>
         <td>${product.variant || "-"}</td>
         <td>${product.category}</td>
         <td>${product.size}</td>
         <td>${product.unit}</td>
         <td>${product.supplier}</td>
         <td>${product.warehouse}</td>
         <td>${formatCompactCurrency(product.importPrice)}</td>
         <td>
           ${formatCompactCurrency(product.salePrice)}
           ${discounted ? `<div style="font-size:12px; color:#94a3b8; text-decoration:line-through; margin-top:4px;">${formatCompactCurrency(product.originalPrice)}</div>` : ""}
         </td>
         <td>${formatCompactCurrency(product.wholesalePrice)}</td>
         <td class="stock-number">${product.stock}</td>
         <td>
           <span class="status-badge ${status.className}">${status.text}</span>
           <div style="margin-top:6px; font-size:12px; color:#64748b;">${product.segment}</div>
         </td>
         <td>
           <div style="display:flex; gap:8px; flex-wrap:wrap;">
             <button class="secondary-btn edit-row-btn" data-id="${product.id}">Edit</button>
             <button class="secondary-btn delete-row-btn" data-id="${product.id}" style="background:#fee2e2; color:#b91c1c;">Delete</button>
           </div>
         </td>
       </tr>
     `;
   })
   .join("");


 inventoryTableBody.querySelectorAll(".edit-row-btn").forEach((button) => {
   button.addEventListener("click", () => editProduct(button.dataset.id));
 });


 inventoryTableBody.querySelectorAll(".delete-row-btn").forEach((button) => {
   button.addEventListener("click", () => deleteProduct(button.dataset.id));
 });
}


function updateDashboardStats(data) {
 const totalProducts = data.length;
 const totalStock = data.reduce((sum, item) => sum + Number(item.stock || 0), 0);
 const lowStockCount = data.filter((item) => Number(item.stock) < 20).length;
 const categories = new Set(data.map((item) => item.category)).size;
 const suppliers = new Set(data.map((item) => item.supplier)).size;


 if (totalProductsEl) totalProductsEl.textContent = totalProducts;
 if (totalStockEl) totalStockEl.textContent = totalStock;
 if (lowStockCountEl) lowStockCountEl.textContent = lowStockCount;
 if (categoryCountEl) categoryCountEl.textContent = categories;
 if (supplierCountEl) supplierCountEl.textContent = suppliers;
}


function renderOverviewCards(data) {
 if (!data.length) {
   topProductName.textContent = "-";
   topProductMeta.textContent = "No data";
   criticalProductName.textContent = "-";
   criticalProductMeta.textContent = "No data";
   inventoryValueEl.textContent = "0";
   saleValueEl.textContent = "0";
   return;
 }


 const highestStock = [...data].sort((a, b) => b.stock - a.stock)[0];
 const lowestStock = [...data].sort((a, b) => a.stock - b.stock)[0];


 const inventoryValue = data.reduce((sum, item) => sum + Number(item.importPrice) * Number(item.stock), 0);
 const saleValue = data.reduce((sum, item) => sum + Number(item.salePrice) * Number(item.stock), 0);


 topProductName.textContent = `${highestStock.productName}`;
 topProductMeta.textContent = `${highestStock.variant} • ${highestStock.warehouse} • Stock: ${highestStock.stock}`;


 criticalProductName.textContent = `${lowestStock.productName}`;
 criticalProductMeta.textContent = `${lowestStock.variant} • ${lowestStock.warehouse} • Stock: ${lowestStock.stock}`;


 inventoryValueEl.textContent = formatCompactCurrency(inventoryValue);
 saleValueEl.textContent = formatCompactCurrency(saleValue);
}


function renderDashboardLowStock(data) {
 if (!dashboardLowStockList) return;


 const lowStockItems = data
   .filter((item) => item.stock < 20)
   .sort((a, b) => a.stock - b.stock)
   .slice(0, 6);


 if (!lowStockItems.length) {
   dashboardLowStockList.innerHTML = `<p class="empty-note">No urgent low stock products right now.</p>`;
   return;
 }


 dashboardLowStockList.innerHTML = lowStockItems
   .map(
     (item) => `
       <div class="low-stock-item">
         <h4>${item.productName}</h4>
         <p>
           Segment: ${item.segment}<br>
           Variant: ${item.variant}<br>
           Warehouse: ${item.warehouse}<br>
           Remaining Stock: <strong>${item.stock}</strong>
           ${isDiscounted(item) ? `<br>Discount: <strong>${item.discountPercent}%</strong>` : ""}
         </p>
       </div>
     `
   )
   .join("");
}


function renderWarehouseSummary(data) {
 if (!warehouseSummaryCards) return;


 const warehouses = ["Main Warehouse", "North Warehouse", "South Warehouse"];


 warehouseSummaryCards.innerHTML = warehouses
   .map((warehouse) => {
     const items = data.filter((item) => item.warehouse === warehouse);
     const stock = items.reduce((sum, item) => sum + item.stock, 0);
     const discounted = items.filter(isDiscounted).length;


     return `
       <div class="summary-row">
         <span class="label">${warehouse}<br><small style="color:#94a3b8;">${items.length} products • ${discounted} discounted</small></span>
         <span class="value">${stock}</span>
       </div>
     `;
   })
   .join("");
}


function renderCategorySummary(data) {
 if (!categorySummaryCards) return;


 const categories = uniqueValues(data, "category");


 categorySummaryCards.innerHTML = categories
   .map((category) => {
     const items = data.filter((item) => item.category === category);
     const discounted = items.filter(isDiscounted).length;


     return `
       <div class="summary-row">
         <span class="label">${category}<br><small style="color:#94a3b8;">${discounted} discounted</small></span>
         <span class="value">${items.length} products</span>
       </div>
     `;
   })
   .join("");
}


function renderInventorySummary(data) {
 if (!inventorySummary) return;


 const warehouseNames = ["Main Warehouse", "North Warehouse", "South Warehouse"];


 const blocks = warehouseNames
   .map((warehouse) => {
     const warehouseItems = data.filter((item) => item.warehouse === warehouse);
     const stock = warehouseItems.reduce((sum, item) => sum + item.stock, 0);
     return `
       <div class="report-item">
         <span>${warehouse} Stock</span>
         <strong>${stock}</strong>
       </div>
     `;
   })
   .join("");


 const discountedCount = data.filter(isDiscounted).length;
 const lowStockProducts = data.filter((item) => item.stock < 20).length;


 inventorySummary.innerHTML = `
   ${blocks}
   <div class="report-item">
     <span>Discounted Products</span>
     <strong>${discountedCount}</strong>
   </div>
   <div class="report-item">
     <span>Low Stock Products</span>
     <strong>${lowStockProducts}</strong>
   </div>
 `;
}


function renderReportSummary(data) {
 if (!reportSummaryList) return;


 const menCount = data.filter((item) => item.segment === "Men").length;
 const womenCount = data.filter((item) => item.segment === "Women").length;
 const kidsCount = data.filter((item) => item.segment === "Kids").length;


 const totalImportValue = data.reduce((sum, item) => sum + item.importPrice * item.stock, 0);
 const totalSaleValue = data.reduce((sum, item) => sum + item.salePrice * item.stock, 0);
 const totalSavingsValue = data.reduce((sum, item) => {
   const savings = Math.max(0, (item.originalPrice || item.salePrice) - item.salePrice);
   return sum + savings * item.stock;
 }, 0);


 reportSummaryList.innerHTML = `
   <div class="report-item">
     <span>Total Men Products</span>
     <strong>${menCount}</strong>
   </div>
   <div class="report-item">
     <span>Total Women Products</span>
     <strong>${womenCount}</strong>
   </div>
   <div class="report-item">
     <span>Total Kids Products</span>
     <strong>${kidsCount}</strong>
   </div>
   <div class="report-item">
     <span>Discounted Products</span>
     <strong>${data.filter(isDiscounted).length}</strong>
   </div>
   <div class="report-item">
     <span>Total Import Inventory Value</span>
     <strong>${formatCompactCurrency(totalImportValue)}</strong>
   </div>
   <div class="report-item">
     <span>Total Sale Inventory Value</span>
     <strong>${formatCompactCurrency(totalSaleValue)}</strong>
   </div>
   <div class="report-item">
     <span>Total Customer Savings Value</span>
     <strong>${formatCompactCurrency(totalSavingsValue)}</strong>
   </div>
 `;
}


function renderCategoriesTable() {
 const section = document.querySelector("#categories .simple-table");
 if (!section) return;


 const categories = uniqueValues(products, "category");
 section.innerHTML = `
   <div class="simple-table-header">
     <span>Category Name</span>
     <span>Description</span>
     <span>Product Count</span>
     <span>Status</span>
   </div>
   ${categories
     .map((category) => {
       const items = products.filter((item) => item.category === category);
       const descriptionMap = {
         Polo: "Men polo shirts and casual collar tops",
         Shirt: "Formal, plaid, denim and office shirts",
         Dress: "Women dresses and occasion wear",
         Set: "Women coordinated outfit sets",
         "Kids Outerwear": "Kids jackets, windbreakers and vests",
         "Kids Set": "Kids matching top-and-bottom sets"
       };
       return `
         <div class="simple-table-row">
           <span>${category}</span>
           <span>${descriptionMap[category] || "Product category"}</span>
           <span>${items.length}</span>
           <span class="pill green">Active</span>
         </div>
       `;
     })
     .join("")}
 `;
}


function renderSuppliersTable() {
 const section = document.querySelector("#suppliers .simple-table");
 if (!section) return;


 const suppliers = uniqueValues(products, "supplier");
 section.innerHTML = `
   <div class="simple-table-header">
     <span>Supplier</span>
     <span>Phone</span>
     <span>Email</span>
     <span>Products</span>
   </div>
   ${suppliers
     .map((supplier, index) => {
       const items = products.filter((item) => item.supplier === supplier);
       const phone = `090${index + 1} ${String(111 + index * 111).padStart(3, "0")} ${String(222 + index * 111).padStart(3, "0")}`;
       const email = supplier.toLowerCase().replace(/\s+/g, "") + "@demo.com";
       return `
         <div class="simple-table-row">
           <span>${supplier}</span>
           <span>${phone}</span>
           <span>${email}</span>
           <span>${items.length}</span>
         </div>
       `;
     })
     .join("")}
 `;
}


function renderWarehousesTable() {
 const section = document.querySelector("#warehouses .simple-table");
 if (!section) return;


 const warehouses = [
   { name: "Main Warehouse", location: "District 1", manager: "Inventory Lead" },
   { name: "North Warehouse", location: "District 9", manager: "North Team Lead" },
   { name: "South Warehouse", location: "Binh Tan", manager: "South Team Lead" }
 ];


 section.innerHTML = `
   <div class="simple-table-header">
     <span>Warehouse</span>
     <span>Location</span>
     <span>Manager</span>
     <span>Status</span>
   </div>
   ${warehouses
     .map((warehouse) => {
       const stock = products.filter((item) => item.warehouse === warehouse.name).reduce((sum, item) => sum + item.stock, 0);
       const statusClass = stock < 80 ? "yellow" : "green";
       const statusText = stock < 80 ? "Needs Review" : "Active";
       return `
         <div class="simple-table-row">
           <span>${warehouse.name}</span>
           <span>${warehouse.location}</span>
           <span>${warehouse.manager}</span>
           <span class="pill ${statusClass}">${statusText}</span>
         </div>
       `;
     })
     .join("")}
 `;
}


function renderStockInTable() {
 const section = document.querySelector("#stockin .simple-table");
 if (!section) return;


 const latest = [...products]
   .sort((a, b) => a.id.localeCompare(b.id))
   .slice(0, 5);


 section.innerHTML = `
   <div class="simple-table-header">
     <span>Stock In ID</span>
     <span>Date</span>
     <span>Supplier</span>
     <span>Warehouse</span>
     <span>Status</span>
   </div>
   ${latest
     .map(
       (item, index) => `
       <div class="simple-table-row">
         <span>IN${String(index + 1).padStart(3, "0")}</span>
         <span>${todayOffset(index + 1)}</span>
         <span>${item.supplier}</span>
         <span>${item.warehouse}</span>
         <span class="pill green">Completed</span>
       </div>
     `
     )
     .join("")}
 `;
}


function renderStockOutTable() {
 const section = document.querySelector("#stockout .simple-table");
 if (!section) return;


 const latest = [...products]
   .filter((item) => item.stock < 30)
   .slice(0, 5);


 section.innerHTML = `
   <div class="simple-table-header">
     <span>Stock Out ID</span>
     <span>Date</span>
     <span>Warehouse</span>
     <span>Purpose</span>
     <span>Status</span>
   </div>
   ${latest
     .map(
       (item, index) => `
       <div class="simple-table-row">
         <span>OUT${String(index + 1).padStart(3, "0")}</span>
         <span>${todayOffset(index)}</span>
         <span>${item.warehouse}</span>
         <span>Store allocation</span>
         <span class="pill blue">Pending</span>
       </div>
     `
     )
     .join("")}
 `;
}


function renderUsersTable() {
 const section = document.querySelector("#users .simple-table");
 if (!section) return;


 section.innerHTML = `
   <div class="simple-table-header">
     <span>Name</span>
     <span>Role</span>
     <span>Email</span>
     <span>Status</span>
   </div>
   <div class="simple-table-row">
     <span>Anna Nguyen</span>
     <span>Admin</span>
     <span>anna@clothtrack.com</span>
     <span class="pill green">Active</span>
   </div>
   <div class="simple-table-row">
     <span>David Tran</span>
     <span>Warehouse Staff</span>
     <span>david@clothtrack.com</span>
     <span class="pill green">Active</span>
   </div>
   <div class="simple-table-row">
     <span>Linda Pham</span>
     <span>Inventory Manager</span>
     <span>linda@clothtrack.com</span>
     <span class="pill blue">Monitoring</span>
   </div>
 `;
}


function renderAll() {
 populateFilters();


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


function setActiveTab(tabId) {
 menuItems.forEach((item) => {
   item.classList.toggle("active", item.dataset.tab === tabId);
 });


 tabContents.forEach((tab) => {
   tab.classList.toggle("active", tab.id === tabId);
 });


 const actionLabels = {
   dashboard: "+ Add Product",
   products: "+ Add Product",
   categories: "+ Add Category",
   suppliers: "+ Add Supplier",
   warehouses: "+ Edit Warehouse",
   stockin: "+ Create Stock In",
   stockout: "+ Create Stock Out",
   inventory: "+ Check Inventory",
   reports: "+ Generate Report",
   users: "+ Add User"
 };


 if (globalActionBtn) {
   globalActionBtn.textContent = actionLabels[tabId] || "+ Add Product";
 }
}


function getActiveTabId() {
 const active = document.querySelector(".tab-content.active");
 return active ? active.id : "dashboard";
}


function createProduct() {
 const product = promptProductDetails();


 if (!product) return;


 products.push(product);
 saveProducts();
 populateFilters();
 renderAll();
 alert(`Product "${product.productName}" has been added successfully.`);
 setActiveTab("products");
}


function editProductByIdPrompt() {
 const id = prompt("Enter the Product ID to edit (example: P001):");
 if (!id) return;
 editProduct(id.trim());
}


function deleteProductByIdPrompt() {
 const id = prompt("Enter the Product ID to delete (example: P001):");
 if (!id) return;
 deleteProduct(id.trim());
}


function editProduct(id) {
 const index = products.findIndex((product) => product.id === id);
 if (index === -1) {
   alert(`Product with ID "${id}" was not found.`);
   return;
 }


 const updatedProduct = promptProductDetails(products[index]);
 if (!updatedProduct) return;


 products[index] = updatedProduct;
 saveProducts();
 populateFilters();
 renderAll();
 alert(`Product "${updatedProduct.productName}" has been updated successfully.`);
 setActiveTab("products");
}


function deleteProduct(id) {
 const product = products.find((item) => item.id === id);
 if (!product) {
   alert(`Product with ID "${id}" was not found.`);
   return;
 }


 const confirmed = confirm(`Delete "${product.productName}" (${product.id})?`);
 if (!confirmed) return;


 products = products.filter((item) => item.id !== id);
 saveProducts();
 populateFilters();
 renderAll();
 alert(`Product "${product.productName}" has been deleted.`);
}


function promptProductDetails(existingProduct = null) {
 const isEdit = Boolean(existingProduct);


 const id = askValue("Product ID", existingProduct?.id || generateNextProductId(), isEdit);
 if (!id) return null;


 if (!isEdit && products.some((product) => product.id === id)) {
   alert(`Product ID "${id}" already exists.`);
   return null;
 }
 if (isEdit && id !== existingProduct.id && products.some((product) => product.id === id)) {
   alert(`Product ID "${id}" already exists.`);
   return null;
 }


 const barcode = askValue("Barcode", existingProduct?.barcode || generateBarcode());
 if (!barcode) return null;


 const productName = askValue("Product Name", existingProduct?.productName || "");
 if (!productName) return null;


 const variant = askValue("Variant", existingProduct?.variant || "");
 if (variant === null) return null;


 const category = askValue(
   "Category (Polo, Shirt, Dress, Set, Kids Outerwear, Kids Set)",
   existingProduct?.category || "Polo"
 );
 if (!category) return null;


 const segment = askValue("Segment (Men, Women, Kids)", existingProduct?.segment || "Men");
 if (!segment) return null;


 const size = askValue("Size", existingProduct?.size || "M");
 if (!size) return null;


 const unit = askValue("Unit (Piece or Set)", existingProduct?.unit || "Piece");
 if (!unit) return null;


 const supplier = askValue("Supplier", existingProduct?.supplier || "Yody Fashion");
 if (!supplier) return null;


 const warehouse = askValue(
   "Warehouse (Main Warehouse, North Warehouse, South Warehouse)",
   existingProduct?.warehouse || "Main Warehouse"
 );
 if (!warehouse) return null;


 const importPrice = askNumber("Import Price", existingProduct?.importPrice ?? 0);
 if (importPrice === null) return null;


 const originalPrice = askNumber("Original Price", existingProduct?.originalPrice ?? 0);
 if (originalPrice === null) return null;


 const salePrice = askNumber("Sale Price", existingProduct?.salePrice ?? 0);
 if (salePrice === null) return null;


 let discountPercent = askNumber("Discount Percent", existingProduct?.discountPercent ?? calculateDiscount(originalPrice, salePrice));
 if (discountPercent === null) return null;
 discountPercent = Math.max(0, Math.min(100, Math.round(discountPercent)));


 const wholesalePrice = askNumber("Wholesale Price", existingProduct?.wholesalePrice ?? Math.round(salePrice * 0.85));
 if (wholesalePrice === null) return null;


 const stock = askNumber("Stock Quantity", existingProduct?.stock ?? 0);
 if (stock === null) return null;


 const colorOptionsRaw = askValue(
   "Color Options (comma separated)",
   existingProduct?.colorOptions?.join(", ") || ""
 );
 if (colorOptionsRaw === null) return null;


 const note = askValue("Notes", existingProduct?.note || "");
 if (note === null) return null;


 return {
   id: id.trim(),
   barcode: barcode.trim(),
   productName: productName.trim(),
   variant: variant.trim(),
   category: normalizeCategory(category.trim()),
   segment: normalizeSegment(segment.trim()),
   size: size.trim(),
   unit: unit.trim(),
   supplier: supplier.trim(),
   warehouse: normalizeWarehouse(warehouse.trim()),
   importPrice: Number(importPrice),
   salePrice: Number(salePrice),
   originalPrice: Number(originalPrice),
   wholesalePrice: Number(wholesalePrice),
   stock: Number(stock),
   discountPercent: Number(discountPercent),
   colorOptions: colorOptionsRaw
     .split(",")
     .map((item) => item.trim())
     .filter(Boolean),
   note: note.trim()
 };
}


function askValue(label, defaultValue = "", readOnly = false) {
 if (readOnly) {
   alert(`Product ID is locked while editing: ${defaultValue}`);
   return defaultValue;
 }
 const value = prompt(label, defaultValue);
 return value === null ? null : value;
}


function askNumber(label, defaultValue = 0) {
 const value = prompt(label, defaultValue);
 if (value === null) return null;
 const parsed = Number(String(value).replace(/,/g, "").trim());
 if (Number.isNaN(parsed)) {
   alert(`${label} must be a valid number.`);
   return null;
 }
 return parsed;
}


function normalizeCategory(value) {
 const categoryMap = {
   polo: "Polo",
   shirt: "Shirt",
   dress: "Dress",
   set: "Set",
   "kids outerwear": "Kids Outerwear",
   "outerwear": "Kids Outerwear",
   "kids set": "Kids Set"
 };


 return categoryMap[value.toLowerCase()] || value;
}


function normalizeSegment(value) {
 const segmentMap = {
   men: "Men",
   women: "Women",
   kids: "Kids"
 };


 return segmentMap[value.toLowerCase()] || value;
}


function normalizeWarehouse(value) {
 const warehouseMap = {
   "main warehouse": "Main Warehouse",
   "north warehouse": "North Warehouse",
   "south warehouse": "South Warehouse"
 };


 return warehouseMap[value.toLowerCase()] || value;
}


function calculateDiscount(originalPrice, salePrice) {
 if (!originalPrice || originalPrice <= 0 || salePrice >= originalPrice) return 0;
 return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}


function generateNextProductId() {
 const maxNumber = products.reduce((max, product) => {
   const match = String(product.id).match(/^P(\d+)$/i);
   const number = match ? Number(match[1]) : 0;
   return Math.max(max, number);
 }, 0);


 return `P${String(maxNumber + 1).padStart(3, "0")}`;
}


function generateBarcode() {
 return String(Date.now()).slice(-12);
}


function stockInPrompt() {
 const id = prompt("Enter the Product ID for stock-in:");
 if (!id) return;


 const product = products.find((item) => item.id === id.trim());
 if (!product) {
   alert("Product not found.");
   return;
 }


 const quantity = askNumber("Enter stock-in quantity:", 10);
 if (quantity === null || quantity <= 0) return;


 product.stock += quantity;
 saveProducts();
 renderAll();
 alert(`Stock-in completed. ${product.productName} now has ${product.stock} units.`);
}


function stockOutPrompt() {
 const id = prompt("Enter the Product ID for stock-out:");
 if (!id) return;


 const product = products.find((item) => item.id === id.trim());
 if (!product) {
   alert("Product not found.");
   return;
 }


 const quantity = askNumber("Enter stock-out quantity:", 5);
 if (quantity === null || quantity <= 0) return;


 if (quantity > product.stock) {
   alert("Not enough stock for this stock-out action.");
   return;
 }


 product.stock -= quantity;
 saveProducts();
 renderAll();
 alert(`Stock-out completed. ${product.productName} now has ${product.stock} units.`);
}


function transferStockPrompt() {
 const id = prompt("Enter the Product ID to transfer:");
 if (!id) return;


 const product = products.find((item) => item.id === id.trim());
 if (!product) {
   alert("Product not found.");
   return;
 }


 const nextWarehouse = prompt(
   "Enter target warehouse (Main Warehouse, North Warehouse, South Warehouse):",
   product.warehouse
 );
 if (!nextWarehouse) return;


 product.warehouse = normalizeWarehouse(nextWarehouse);
 saveProducts();
 renderAll();
 alert(`${product.productName} is now assigned to ${product.warehouse}.`);
}


function exportProductsAsJson() {
 const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url;
 link.download = "clothtrack-products.json";
 link.click();
 URL.revokeObjectURL(url);
}


function showQuickReport() {
 const discounted = products.filter(isDiscounted).length;
 const lowStock = products.filter((item) => item.stock < 20).length;
 const outOfStock = products.filter((item) => item.stock <= 0).length;
 const totalValue = products.reduce((sum, item) => sum + item.salePrice * item.stock, 0);


 alert(
   [
     "Inventory Quick Report",
     `Total Products: ${products.length}`,
     `Discounted Products: ${discounted}`,
     `Low Stock Products: ${lowStock}`,
     `Out of Stock Products: ${outOfStock}`,
     `Total Sale Inventory Value: ${formatCompactCurrency(totalValue)} VND`
   ].join("\n")
 );
 setActiveTab("reports");
}


function focusLowStockProducts() {
 if (stockFilter) stockFilter.value = "low";
 extraFilters.discount = "all";
 const discountFilter = document.getElementById("discountFilter");
 if (discountFilter) discountFilter.value = "all";
 renderAll();
 setActiveTab("products");
}


function todayOffset(daysAgo = 0) {
 const date = new Date();
 date.setDate(date.getDate() - daysAgo);
 return date.toISOString().split("T")[0];
}



