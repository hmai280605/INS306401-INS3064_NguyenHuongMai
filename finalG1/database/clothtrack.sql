-- ClothTrack Inventory Management System
-- Database Schema + Seed Data

CREATE DATABASE IF NOT EXISTS clothtrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clothtrack;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin','manager','staff') DEFAULT 'staff',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  status ENUM('active','inactive') DEFAULT 'active'
);

-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active'
);

-- ============================================================
-- WAREHOUSES
-- ============================================================
CREATE TABLE IF NOT EXISTS warehouses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  location VARCHAR(200),
  manager VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active'
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(10) PRIMARY KEY,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  variant VARCHAR(100),
  category VARCHAR(100),
  segment ENUM('Men','Women','Kids') NOT NULL,
  size VARCHAR(20),
  unit VARCHAR(20) DEFAULT 'Piece',
  supplier VARCHAR(100),
  warehouse VARCHAR(100),
  import_price DECIMAL(15,0) DEFAULT 0,
  sale_price DECIMAL(15,0) DEFAULT 0,
  original_price DECIMAL(15,0) DEFAULT 0,
  wholesale_price DECIMAL(15,0) DEFAULT 0,
  stock INT DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  color_options TEXT,
  note TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- STOCK IN
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_in (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id VARCHAR(20),
  product_id VARCHAR(10),
  supplier VARCHAR(100),
  warehouse VARCHAR(100),
  quantity INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('pending','completed','cancelled') DEFAULT 'completed',
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================================
-- STOCK OUT
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_out (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id VARCHAR(20),
  product_id VARCHAR(10),
  warehouse VARCHAR(100),
  quantity INT NOT NULL,
  date DATE NOT NULL,
  purpose VARCHAR(200) DEFAULT 'Store allocation',
  status ENUM('pending','completed','cancelled') DEFAULT 'completed',
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================================
-- SEED DATA: Users
-- password = 123456 (bcrypt)
-- ============================================================
INSERT INTO users (username, password, name, email, role, status) VALUES
('admin', '$2y$10$iJNT8A.E0GewAY93zG8DHeasSTU8BzRUu5J6Nwjakkr1z2KpCnxbS', 'Admin User', 'admin@clothtrack.com', 'admin', 'active'),
('anna', '$2y$10$iJNT8A.E0GewAY93zG8DHeasSTU8BzRUu5J6Nwjakkr1z2KpCnxbS', 'Anna Nguyen', 'anna@clothtrack.com', 'manager', 'active'),
('david', '$2y$10$iJNT8A.E0GewAY93zG8DHeasSTU8BzRUu5J6Nwjakkr1z2KpCnxbS', 'David Tran', 'david@clothtrack.com', 'staff', 'active'),
('linda', '$2y$10$iJNT8A.E0GewAY93zG8DHeasSTU8BzRUu5J6Nwjakkr1z2KpCnxbS', 'Linda Pham', 'linda@clothtrack.com', 'staff', 'active');

-- ============================================================
-- SEED DATA: Categories
-- ============================================================
INSERT INTO categories (name, description) VALUES
('Polo', 'Men polo shirts and casual collar tops'),
('Shirt', 'Formal, plaid, denim and office shirts'),
('Dress', 'Women dresses and occasion wear'),
('Set', 'Women coordinated outfit sets'),
('Kids Outerwear', 'Kids jackets, windbreakers and vests'),
('Kids Set', 'Kids matching top-and-bottom sets');

-- ============================================================
-- SEED DATA: Suppliers
-- ============================================================
INSERT INTO suppliers (name, phone, email) VALUES
('Yody Fashion', '0901 111 222', 'yodyfashion@demo.com'),
('Cafe Fashion', '0902 222 333', 'cafefashion@demo.com'),
('Yody Women', '0903 333 444', 'yodywomen@demo.com'),
('Yody Kids', '0904 444 555', 'yodykids@demo.com');

-- ============================================================
-- SEED DATA: Warehouses
-- ============================================================
INSERT INTO warehouses (name, location, manager) VALUES
('Main Warehouse', 'District 1', 'Inventory Lead'),
('North Warehouse', 'District 9', 'North Team Lead'),
('South Warehouse', 'Binh Tan', 'South Team Lead');

-- ============================================================
-- SEED DATA: Products
-- ============================================================
INSERT INTO products (id,barcode,product_name,variant,category,segment,size,unit,supplier,warehouse,import_price,sale_price,original_price,wholesale_price,stock,discount_percent,color_options,note,image) VALUES
('P001','893001000001','Men Honeycomb Knit Polo Shirt','Red','Polo','Men','L','Piece','Yody Fashion','Main Warehouse',120000,169000,199000,145000,48,16,'Red,Mustard,Blue,Black','Short sleeve polo','images/p001.png'),
('P002','893001000002','Men Striped Yody Polo','Black / White','Polo','Men','L','Piece','Yody Fashion','North Warehouse',130000,184500,369000,160000,22,50,'Black,Blue','Striped polo design','images/p002.png'),
('P003','893001000003','Men Short Sleeve Contrast Collar Polo','White / Navy','Polo','Men','L','Piece','Yody Fashion','Main Warehouse',135000,199000,349000,175000,35,43,'White,Navy,Black,Beige','Contrast collar detail','images/p003.png'),
('P004','893001000004','Men Long Sleeve Office Shirt','White','Shirt','Men','L','Piece','Cafe Fashion','South Warehouse',290000,499000,499000,360000,18,0,'White,Blue,Navy','Formal office shirt','images/p004.png'),
('P005','893001000005','Men Short Sleeve Plaid Shirt','Blue Plaid','Shirt','Men','L','Piece','Cafe Fashion','North Warehouse',270000,469000,469000,330000,26,0,'Blue Plaid,Grey Plaid','Plaid short sleeve shirt','images/p005.png'),
('P006','893001000006','Men Denim Pocket Shirt','Denim Blue','Shirt','Men','L','Piece','Cafe Fashion','Main Warehouse',275000,469000,469000,340000,14,0,'Denim Blue','Chest pocket design','images/p006.png'),
('P007','893001000007','Luxury Party Dress For Women','Blush Pink','Dress','Women','M','Piece','Yody Women','Main Warehouse',390000,649000,649000,470000,16,0,'Beige,White,Black','Elegant party dress','images/p007.png'),
('P008','893001000008','Casual Midi Dress Collection','Light Purple','Dress','Women','M','Piece','Yody Women','South Warehouse',540000,899000,899000,650000,9,0,'Lavender','Premium midi collection','images/p008.png'),
('P009','893001000009','Vintage Collar Waist Dress','Soft Pink','Dress','Women','M','Piece','Yody Women','North Warehouse',120000,199000,199000,150000,37,0,'Pink,White','Waist tie layered dress','images/p009.png'),
('P010','893001000010','Women Number 99 Tee Shorts Set','Navy','Set','Women','M','Set','Yody Women','Main Warehouse',290000,499000,499000,360000,27,0,'Purple,Cream','Printed 99 matching set','images/p0010.png'),
('P011','893001000011','Women Raglan Lounge Set','Brown / Cream','Set','Women','M','Set','Yody Women','South Warehouse',160000,249500,499000,210000,12,50,'Brown','Raglan casual set','images/p0011.png'),
('P012','893001000012','Elegant Women Textured Set','Black','Set','Women','M','Set','Yody Women','North Warehouse',215000,349000,349000,260000,21,0,'Black,Beige','Formal short set','images/p0012.png'),
('P013','893001000013','Kids Standing Collar Puffer Vest','Cream','Kids Outerwear','Kids','6Y','Piece','Yody Kids','Main Warehouse',240000,399000,399000,300000,24,0,'Cream,Navy','Standing collar vest','images/p0013.png'),
('P014','893001000014','Kids Smart Windbreaker','Orange Red','Kids Outerwear','Kids','7Y','Piece','Yody Kids','North Warehouse',155000,249500,499000,210000,33,50,'Orange,Grey,Navy,Pink,Black','Smart windbreaker','images/p0014.png'),
('P015','893001000015','Kids Hooded Fleece Jacket','Light Grey','Kids Outerwear','Kids','7Y','Piece','Yody Kids','South Warehouse',155000,249500,499000,210000,11,50,'Grey,Black','Warm fleece lining','images/p0015.png'),
('P016','893001000016','Little Girl Berry Set','White / Orange','Kids Set','Kids','5Y','Set','Yody Kids','Main Warehouse',180000,299000,299000,230000,28,0,'Orange,Pink','Sleeveless berry set','images/p0016.png'),
('P017','893001000017','Little Boy Sundaze Set','White / Navy','Kids Set','Kids','6Y','Set','Yody Kids','North Warehouse',180000,299000,299000,230000,19,0,'Cream,Yellow,Green','Printed tee shorts set','images/p0017.png'),
('P018','893001000018','Little Girl Strawberry Set','Yellow','Kids Set','Kids','5Y','Set','Yody Kids','South Warehouse',180000,299000,299000,230000,29,0,'Cream,Lilac,Peach','Strawberry print set','images/p0018.png');
