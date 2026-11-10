<div align="center">

  # POS & Inventory Management System

  ### Desktop App — Java Swing

  **Fast checkout. Honest stock. Clear reports.**  
  *Role-based sales, products, customers and JasperReports invoices on a local MySQL database.*

  <br />

  <p>
    <a href="https://github.com/damsarachethiyaa-dev/POS-Inventory-Management-System/releases/latest"><img src="https://img.shields.io/badge/DOWNLOAD-WINDOWS_ZIP_(V1.0.0)-00e676?style=for-the-badge&labelColor=23272e&logo=windows&logoColor=white" alt="DOWNLOAD WINDOWS ZIP (V1.0.0)" /></a>
    &nbsp;
    <a href="https://damsarachethiyaa-dev.github.io/github-portfolio/#projects"><img src="https://img.shields.io/badge/PORTFOLIO-CASE_STUDY-7c4dff?style=for-the-badge&labelColor=23272e&logo=googlechrome&logoColor=white" alt="PORTFOLIO CASE STUDY" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/JAVA-8_%7C_17_LTS-ED8B00?style=for-the-badge&labelColor=23272e&logo=openjdk&logoColor=white" alt="JAVA 8 | 17 LTS" />
    &nbsp;
    <img src="https://img.shields.io/badge/GUI-SWING_+_FLATLAF-5382a1?style=for-the-badge&labelColor=23272e" alt="GUI SWING + FLATLAF" />
    &nbsp;
    <img src="https://img.shields.io/badge/DATABASE-MYSQL_8.0-005C84?style=for-the-badge&labelColor=23272e&logo=mysql&logoColor=white" alt="DATABASE MYSQL 8.0" />
    &nbsp;
    <img src="https://img.shields.io/badge/REPORTS-JASPERREPORTS_6.21-2e7d32?style=for-the-badge&labelColor=23272e" alt="REPORTS JASPERREPORTS 6.21" />
    &nbsp;
    <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-MIT-ff6d00?style=for-the-badge&labelColor=23272e" alt="LICENSE MIT" /></a>
  </p>

  <p>
    <a href="https://github.com/damsarachethiyaa-dev/POS-Inventory-Management-System/releases">
      <img src="https://img.shields.io/github/downloads/damsarachethiyaa-dev/POS-Inventory-Management-System/total?style=for-the-badge&logo=github&logoColor=white&label=TOTAL%20DOWNLOADS&labelColor=23272e&color=00e676" alt="Total downloads" />
    </a>
  </p>

  <p>
    <img src="docs/readme-stats.svg" width="606" alt="Latest release v1.0.0, admin and cashier roles, MIT open source" />
  </p>


</div>

<br />

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
