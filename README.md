# POS & Inventory Management System 🛒📦

[![Release](https://img.shields.io/badge/Release-v1.0.0--Standalone-blue?style=flat-square&logo=github)](https://github.com/damsarachethiyaa-dev/POS-Inventory-Management-System/releases/latest)
[![Java](https://img.shields.io/badge/Java-8%20%7C%2017%20LTS-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Swing](https://img.shields.io/badge/GUI-Java%20Swing%20%2B%20FlatLaf-5382a1?style=flat-square)](https://www.formdev.com/flatlaf/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-005C84?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JasperReports](https://img.shields.io/badge/Reports-JasperReports%206.21-green?style=flat-square)](https://community.jaspersoft.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

A modern, responsive desktop Point of Sale (POS) and Inventory Management System built with **Java Swing**, **FlatLaf**, **JasperReports**, and **MySQL**. Designed for retail businesses and storefronts requiring fast checkout, automated stock tracking, customer relationship management, and invoice/report generation.

---

## 🎮 Quick Demo: Run Without Installing Java / NetBeans

A pre-packaged standalone Windows binary with embedded JRE runtime is available directly in the [Releases](https://github.com/damsarachethiyaa-dev/POS-Inventory-Management-System/releases/latest):

1. **Download:** [**`POS-Windows-v1.0.0.zip`**](https://github.com/damsarachethiyaa-dev/POS-Inventory-Management-System/releases/latest) (Standalone Windows Bundle).
2. **Database:** Ensure your local MySQL service has the schema from [`database/POS_DB.sql`](database/POS_DB.sql) imported.
3. **Launch:** Extract the zip and double-click `POS.exe` to run the application immediately!

#### Default Demo Credentials:
| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pos.com` | `admin123` | Administrator |
| **Manager / Cashier** | `damsara@pos.com` | `pass123` | Active Staff |

---

## ✨ Features

- **🔐 Authentication & Role Management**
  - Secure login with role-based permissions (`Admin`, `Cashier`).
  - User status controls (`Active`, `Inactive`) to restrict disabled accounts.
  - Full user management interface to create, edit, activate, or deactivate accounts.

- **📦 Product & Inventory Tracking**
  - Manage product catalogs with names, descriptions, unit prices, and stock quantities.
  - Categorize products dynamically into custom categories.
  - Instant search, filtering, and real-time stock updates upon purchase.

- **👥 Customer Management**
  - Register and maintain customer records with contact numbers and emails.
  - Link customer profiles to orders for billing history and analytics.

- **🧾 Order Processing & POS Billing**
  - Intuitive, fast checkout interface with dynamic cart tables.
  - Automatic invoice number generation (`Bill-XXXXXXXX`).
  - Total calculations with instant payment tracking and receipt printing.
  - Real-time stock decrement upon order completion.

- **📄 Reporting & PDF Generation**
  - Built-in JasperReports templates (`.jrxml` & `.jasper`).
  - Export customer summary reports and user activity reports to PDF.
  - Instant digital invoice viewer and thermal receipt layout support.

- **🎨 Modern Dark/Flat UI**
  - Styled with **FlatLaf 3.6** for clean modern aesthetics.
  - Custom rounded cards (`PanelRound`), smooth scrollbars (`ScrollBar`), and styled data tables.
  - Flexible layout powered by **MigLayout**.

---

## 🛠️ Technology Stack

| Component | Technology / Library |
| :--- | :--- |
| **Language** | Java (JDK 8+) |
| **GUI Framework** | Java Swing & AWT |
| **Look & Feel** | FlatLaf 3.6 & Custom Swing Components |
| **Layout Manager** | MigLayout 5.3 & AbsoluteLayout |
| **Database** | MySQL 8.0 / MariaDB (JDBC Connector 8.0.18) |
| **Reporting Engine** | JasperReports 6.21.5 & OpenPDF / iText |
| **Build System** | Apache Ant (NetBeans project structure) |

---

## 📁 Project Structure

```text
POS/
├── database/               # Database SQL schema, seed data, and report compilation utility
│   ├── POS_DB.sql          # Complete MySQL schema & initial seed data
│   └── CompileReports.java # Helper script to compile JasperReports (.jrxml -> .jasper)
├── Documentation/          # Project documentation generators (SRS & Report scripts)
├── lib/                    # All required JAR dependencies (FlatLaf, JasperReports, MySQL, etc.)
├── nbproject/              # NetBeans project configuration and Ant build targets
├── src/                    # Java source code
│   └── JIAT/
│       ├── Common/         # PDF generator & opener utilities
│       ├── Component/      # Reusable modern UI components (Buttons, Panels, Tables, Scrollbars)
│       ├── Connetion/      # MySQL JDBC connection provider & inventory utilities
│       ├── Images/         # Application icons and graphic assets
│       ├── Logger/         # Application logging utilities
│       ├── Login/          # Main application forms (Login, Home, ManageProduct, ManageOrder, etc.)
│       └── Report/         # JasperReports templates (.jrxml and compiled .jasper)
├── build.xml               # Apache Ant master build file
├── manifest.mf             # Application JAR manifest
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Version 8 or higher (JDK 17+ recommended).
- **MySQL Server**: Version 5.7 or 8.0+.
- **IDE** (Optional): Apache NetBeans, IntelliJ IDEA, or Eclipse.

---

### 1. Database Setup

1. Start your local MySQL service.
2. Open your favorite database management tool (MySQL Workbench, phpMyAdmin, DBeaver, or terminal).
3. Import and execute the SQL script located at:
   ```text
   database/POS_DB.sql
   ```
   This will create the database `POS_DB` and populate initial tables and seed data.

#### Default Admin Credentials (Seed Data):
- **Email:** `admin@pos.com`
- **Password:** `admin123`

---

### 2. Configure Database Connection

Open `src/JIAT/Connetion/ConnetionProvider.java` and adjust your MySQL connection parameters:

```java
private final String server = "localhost";
private final String port = "3306";
private final String database = "pos_system"; // or "POS_DB" based on your schema name
private final String userName = "root";
private final String password = "YOUR_DB_PASSWORD"; // Update with your local MySQL password
```

---

### 3. Build & Run

#### Option A: Using Apache NetBeans (Recommended)
1. Open NetBeans IDE.
2. Go to **File** > **Open Project...** and select this repository folder.
3. Right-click the project and select **Clean and Build**.
4. Right-click the project and select **Run** (Main class: `JIAT.Login.Login`).

#### Option B: Using Command Line (Ant)
```bash
# Clean and compile the project
ant clean compile

# Run the application
ant run
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
