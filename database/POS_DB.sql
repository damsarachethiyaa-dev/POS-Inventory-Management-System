-- =============================================================================
--  POS & Inventory Management System
--  Full database schema with enforced relationships
--  Database name : POS_DB
--  Engine        : InnoDB (required for foreign keys)
--  Charset       : utf8mb4
-- =============================================================================

DROP DATABASE IF EXISTS POS_DB;
CREATE DATABASE POS_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE POS_DB;

-- -----------------------------------------------------------------------------
-- Table: user   (system users / login accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE user (
    UserID        INT          NOT NULL AUTO_INCREMENT,
    UserRole      VARCHAR(50)  NOT NULL DEFAULT 'Admin',
    UserName      VARCHAR(255) NOT NULL,
    MobileNumber  VARCHAR(50),
    Email         VARCHAR(255) NOT NULL,
    Password      VARCHAR(255) NOT NULL,
    Address       VARCHAR(50),
    Status        VARCHAR(255) NOT NULL DEFAULT 'Active',
    PRIMARY KEY (UserID),
    UNIQUE KEY uq_user_email (Email)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table: customer
-- -----------------------------------------------------------------------------
CREATE TABLE customer (
    CustomerID    INT          NOT NULL AUTO_INCREMENT,
    CustomerName  VARCHAR(50)  NOT NULL,
    MobileNumber  VARCHAR(50),
    Email         VARCHAR(50),
    PRIMARY KEY (CustomerID)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table: category
-- -----------------------------------------------------------------------------
CREATE TABLE category (
    CategoryID    INT          NOT NULL AUTO_INCREMENT,
    CategoryName  VARCHAR(50)  NOT NULL,
    PRIMARY KEY (CategoryID)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table: product
--   CategoryFK -> category.CategoryID   (one category has many products)
-- -----------------------------------------------------------------------------
CREATE TABLE product (
    ProductID     INT          NOT NULL AUTO_INCREMENT,
    ProductName   VARCHAR(50)  NOT NULL,
    Quantity      INT          NOT NULL DEFAULT 0,
    Price         INT          NOT NULL DEFAULT 0,
    Description   VARCHAR(50),
    CategoryFK    INT          NOT NULL,
    PRIMARY KEY (ProductID),
    KEY idx_product_category (CategoryFK),
    CONSTRAINT fk_product_category
        FOREIGN KEY (CategoryFK) REFERENCES category (CategoryID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table: orderdetails
--   CustomerID -> customer.CustomerID   (one customer has many orders)
--   Order_Pk   : surrogate primary key
--   OrderID    : human-readable bill number (e.g. Bill-123456789)
-- -----------------------------------------------------------------------------
CREATE TABLE orderdetails (
    Order_Pk      INT          NOT NULL AUTO_INCREMENT,
    OrderID       VARCHAR(50)  NOT NULL,
    CustomerID    INT          NOT NULL,
    OrderDate     VARCHAR(50)  NOT NULL,
    TatalPaid     INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (Order_Pk),
    UNIQUE KEY uq_order_orderid (OrderID),
    KEY idx_order_customer (CustomerID),
    CONSTRAINT fk_order_customer
        FOREIGN KEY (CustomerID) REFERENCES customer (CustomerID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================================
--  SEED DATA  (so the application runs immediately)
-- =============================================================================

-- Admin login account  ->  Email: admin@pos.com   Password: admin123
INSERT INTO user (UserRole, UserName, MobileNumber, Email, Password, Address, Status) VALUES
('Admin', 'System Administrator', '0770000000', 'admin@pos.com', 'admin123', 'Head Office', 'Active'),
('Admin', 'Damsara C.',           '0771111111', 'damsara@pos.com', 'pass123', 'Colombo',    'Active');

-- Categories
INSERT INTO category (CategoryName) VALUES
('Beverages'),
('Snacks'),
('Stationery'),
('Electronics');

-- Customers
INSERT INTO customer (CustomerName, MobileNumber, Email) VALUES
('Walk-in Customer', '0000000000', 'walkin@pos.com'),
('Nimal Perera',     '0712345678', 'nimal@example.com'),
('Kamal Silva',      '0723456789', 'kamal@example.com');

-- Products  (some intentionally below the 50 low-stock threshold for the dashboard)
INSERT INTO product (ProductName, Quantity, Price, Description, CategoryFK) VALUES
('Coca Cola 1L',     120, 350, 'Soft drink bottle',     1),
('Coffee Pack 200g',  40, 850, 'Ground coffee',         1),
('Potato Chips',      25, 200, 'Salted chips 100g',     2),
('Chocolate Bar',     15, 150, 'Milk chocolate',        2),
('A4 Note Book',     200, 180, '120 page ruled book',   3),
('Ball Point Pen',    35,  40, 'Blue ink pen',          3),
('USB Flash Drive',   10, 1500,'32GB USB 3.0',          4),
('Wireless Mouse',     8, 1200,'2.4GHz optical mouse',  4);

-- A sample completed order (so dashboard order count and reports are non-empty)
INSERT INTO orderdetails (OrderID, CustomerID, OrderDate, TatalPaid) VALUES
('Bill-100000001', 2, '10-06-2026', 700),
('Bill-100000002', 3, '10-06-2026', 1500);

-- =============================================================================
--  Quick verification
-- =============================================================================
-- SELECT * FROM user;
-- SELECT * FROM category;
-- SELECT p.ProductName, p.Quantity, c.CategoryName
--   FROM product p JOIN category c ON p.CategoryFK = c.CategoryID;
-- SELECT o.OrderID, cu.CustomerName, o.TatalPaid
--   FROM orderdetails o JOIN customer cu ON o.CustomerID = cu.CustomerID;
