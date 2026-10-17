const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, PageBreak, TableOfContents, TabStopType, TabStopPosition,
} = require("docx");

const TITLE = "POS & Inventory Management System";
const CONTENT_W = 9360;
const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const p = (t, opts = {}) => new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: t, ...opts })] });
const bullet = (t, level = 0) => new Paragraph({ numbering: { reference: "pbul", level }, children: [new TextRun(t)] });
const numItem = (t) => new Paragraph({ numbering: { reference: "pnum", level: 0 }, children: [new TextRun(t)] });

function gridTable(headers, dataRows, colW) {
  const rows = [new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => new TableCell({
      borders, width: { size: colW[i], type: WidthType.DXA }, margins: cellMargins,
      shading: { fill: "2E5C8A", type: ShadingType.CLEAR },
      children: [new Paragraph({ children: [new TextRun({ text: hd, bold: true, color: "FFFFFF" })] })],
    })),
  })];
  dataRows.forEach((r, ri) => {
    rows.push(new TableRow({
      children: r.map((cell, i) => new TableCell({
        borders, width: { size: colW[i], type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: ri % 2 ? "F2F6FA" : "FFFFFF", type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun(String(cell))] })],
      })),
    }));
  });
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colW, rows });
}

// ---- Front matter -----------------------------------------------------------
const titlePage = [
  new Paragraph({ spacing: { before: 400, after: 120 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "«University / Institute Name»", bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: "«Faculty / Department»", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1000 },
    children: [new TextRun({ text: "«Course / Module Name & Code»", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "Project Report", italics: true, size: 28, color: "777777" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 1000 },
    children: [new TextRun({ text: TITLE, bold: true, size: 40, color: "1F3F66" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: "Submitted by", size: 22, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new TextRun({ text: "«Your Full Name»", bold: true, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: "«Registration / Index Number»", size: 22 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: "Supervised by", size: 22, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: "«Supervisor / Lecturer Name»", bold: true, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "«Submission Date»", size: 22 })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const declaration = [
  h1("Declaration"),
  p("I hereby declare that this project report titled “" + TITLE + "” is my own original work carried out as part of «Course / Module Name & Code» at «University / Institute Name». The work has not been submitted, in whole or in part, for any other degree or qualification. All sources of information and external libraries used have been acknowledged in the references."),
  new Paragraph({ spacing: { before: 800 }, children: [new TextRun("Signature: ………………………………")] }),
  new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Name: «Your Full Name»")] }),
  new Paragraph({ spacing: { before: 200 }, children: [new TextRun("Date: «Submission Date»")] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const ack = [
  h1("Acknowledgement"),
  p("I would like to express my sincere gratitude to my supervisor, «Supervisor / Lecturer Name», for the guidance, encouragement, and valuable feedback provided throughout this project. I also thank the staff of «University / Institute Name» for their support, and my family and friends for their constant motivation. Finally, I acknowledge the open-source communities behind Java, MySQL, FlatLaf, JasperReports, and OpenPDF, whose tools made this project possible."),
  new Paragraph({ children: [new PageBreak()] }),
];

const abstract = [
  h1("Abstract"),
  p("The POS & Inventory Management System is a Java desktop application designed to help a small retail business move from manual record-keeping to a reliable computerised system. It combines point-of-sale billing with inventory control in a single tool. Using the application, an administrator can manage products and their categories, maintain customer and system-user records, and process customer orders through a cart-based workflow that validates stock, deducts inventory automatically, records each sale, and produces a printable PDF bill. A dashboard provides at-a-glance totals of products, customers, and orders, and highlights items that are low in stock so they can be reordered in time."),
  p("The system is built with Java 17 and the Swing GUI toolkit, themed with the FlatLaf look-and-feel for a modern appearance. Data is stored in a MySQL relational database accessed through JDBC, and reports are produced with JasperReports and OpenPDF. This report documents the background and objectives of the project, the analysis and design decisions, the database schema, the implementation of each module, the testing performed, and directions for future improvement."),
  new Paragraph({ children: [new PageBreak()] }),
];

const toc = [
  h1("Table of Contents"),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 1. Introduction --------------------------------------------------------
const intro = [
  h1("1. Introduction"),
  h2("1.1 Background"),
  p("Many small shops still record sales and stock by hand. Manual methods are slow, error-prone, and make it hard to know current stock levels or review past sales. A Point-of-Sale (POS) system combined with inventory management solves these problems by capturing each sale electronically and keeping stock counts up to date automatically. This project develops such a system as a desktop application suitable for a single shop."),
  h2("1.2 Problem Statement"),
  p("Without a computerised system, shop staff face several difficulties: stock figures become inaccurate, low-stock items are noticed too late, bills are written manually, and customer and sales history is difficult to retrieve. There is a need for an affordable, easy-to-use application that records sales, keeps inventory accurate in real time, and produces bills and reports reliably."),
  h2("1.3 Objectives"),
  bullet("To design and implement a desktop POS and inventory system for a small retail business."),
  bullet("To provide secure, authenticated access for administrators."),
  bullet("To manage products, categories, customers, and system users through simple screens."),
  bullet("To process sales with a cart workflow that validates stock and deducts inventory automatically."),
  bullet("To generate printable PDF bills and customer/user reports."),
  bullet("To present a dashboard with key totals and low-stock alerts."),
  h2("1.4 Scope"),
  p("The system covers user authentication, dashboard summaries, product and category management, customer management, user management, order processing with billing, and reporting. It is intended for a single shop running on a Windows desktop connected to a local MySQL database."),
  h2("1.5 Limitations"),
  bullet("The application targets the Windows desktop; the bill auto-open feature uses Windows shell commands."),
  bullet("It is designed for single-shop, single-database use rather than multi-branch operation."),
  bullet("In the current version all operational users share the ‘Admin’ role."),
  bullet("Database credentials are presently embedded in the source and should be externalised for production."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 2. Existing system -----------------------------------------------------
const existing = [
  h1("2. Existing System and Literature Review"),
  p("Manual and spreadsheet-based methods are still common in small shops. While spreadsheets improve on paper, they do not enforce stock validation, do not generate bills, and are easily corrupted by manual edits. Commercial POS packages exist but are often expensive, subscription-based, or more complex than a small shop needs. This project takes the middle path: a lightweight, self-hosted desktop system that captures the essential POS and inventory features without ongoing cost."),
  p("The design draws on standard practice in desktop business applications: a relational database for integrity, prepared statements for safe data access, a layered structure separating UI from data access, and report tooling (JasperReports) for professional output."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 3. Methodology ---------------------------------------------------------
const method = [
  h1("3. Methodology"),
  h2("3.1 Development Methodology"),
  p("An iterative, incremental approach was followed. The system was broken into modules (authentication, dashboard, product, category, customer, order, user, reporting) and each was designed, implemented, and tested before moving on. This allowed early functionality to be validated and refined as understanding of the requirements grew."),
  h2("3.2 Tools and Technologies"),
  gridTable(
    ["Area", "Technology", "Role in the Project"],
    [
      ["Language", "Java 17", "Core application logic"],
      ["UI toolkit", "Java Swing + FlatLaf 3.6", "Desktop graphical interface and modern theme"],
      ["IDE", "Apache NetBeans 25", "Development, GUI form design, build"],
      ["Build", "Apache Ant", "Compilation and packaging into POS.jar"],
      ["Database", "MySQL 8.x", "Persistent storage (schema pos_system)"],
      ["DB driver", "MySQL Connector/J 8.0.18", "JDBC connectivity"],
      ["Reporting", "JasperReports 6.21.5", "Customer and user reports"],
      ["PDF", "OpenPDF 1.3.30 / iText 2.1.7", "Bill generation"],
    ],
    [1900, 3000, 4460]
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 4. System Analysis -----------------------------------------------------
const analysis = [
  h1("4. System Analysis"),
  h2("4.1 Functional Requirements"),
  bullet("Authenticate administrators and deny access to invalid or inactive users."),
  bullet("Display dashboard totals (products, customers, orders) and low-stock products."),
  bullet("Create, update, and list products, categories, customers, and users."),
  bullet("Process orders: build a cart, validate stock, deduct inventory, record the sale, and produce a bill."),
  bullet("Generate customer and user reports."),
  h2("4.2 Non-Functional Requirements"),
  bullet("Usability — consistent, simple screens with clear messages."),
  bullet("Reliability — release database resources and report errors rather than failing silently."),
  bullet("Security — authentication, prepared statements, and role-based access."),
  bullet("Performance — responsive screens for the data volumes of a small shop."),
  bullet("Maintainability — modular, feature-per-screen organisation."),
  h2("4.3 Feasibility Study"),
  h3("4.3.1 Technical Feasibility"),
  p("All chosen technologies are mature, free, and widely supported. Java, MySQL, and the selected libraries run on standard desktop hardware, so the system is technically feasible."),
  h3("4.3.2 Economic Feasibility"),
  p("The system uses open-source tools with no licensing cost. The only requirement is a standard Windows PC, making it economically feasible for a small shop."),
  h3("4.3.3 Operational Feasibility"),
  p("The interface is simple and task-oriented, so staff with basic computer skills can operate it after short training. It directly addresses the shop’s day-to-day needs, making it operationally feasible."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 5. System Design -------------------------------------------------------
const design = [
  h1("5. System Design"),
  h2("5.1 System Architecture"),
  p("The application uses a layered architecture. The Swing presentation layer renders screens and captures input. Business logic lives in the event handlers of each screen and in helper classes (bill and report generation). A single connection-provider class (a singleton) supplies JDBC connections to the MySQL database, which forms the data layer."),
  gridTable(
    ["Layer", "Key Classes / Elements"],
    [
      ["Presentation", "Login, Home, ManageProduct, ManageCategory, ManageCustomer, ManageOder, ManegeUsers, ViewOrders"],
      ["Business logic", "Form event handlers, PdfGenerator, report helper methods"],
      ["Data access", "ConnetionProvider (JDBC singleton)"],
      ["Database", "MySQL schema pos_system"],
    ],
    [2400, 6960]
  ),
  h2("5.2 Database Design"),
  p("The database holds five principal tables. Products are classified by category; orders are linked to customers. The key columns are listed below."),
  gridTable(
    ["Table", "Key Columns", "Relationship"],
    [
      ["user", "UserID (PK), UserRole, UserName, Email, Password, MobileNumber, Address, Status", "—"],
      ["customer", "CustomerID (PK), CustomerName, MobileNumber, Email", "1 customer → many orders"],
      ["category", "CategoryID (PK), CategoryName", "1 category → many products"],
      ["product", "ProductID (PK), ProductName, Quantity, Price, Description, CategoryFK", "CategoryFK → category.CategoryID"],
      ["orderdetails", "OrderID, CustomerID, OrderDate, TatalPaid", "CustomerID → customer.CustomerID"],
    ],
    [1700, 5260, 2400]
  ),
  p("Entity relationships (for the ER diagram in the final report): category (1)—(*) product; customer (1)—(*) orderdetails. The user table is independent and drives authentication."),
  h2("5.3 Module Design"),
  bullet("Authentication module — validates credentials and opens the dashboard."),
  bullet("Dashboard module — aggregates counts and low-stock items."),
  bullet("Product / Category modules — maintain inventory master data."),
  bullet("Customer / User modules — maintain people records."),
  bullet("Order module — cart, stock checks, order persistence, billing."),
  bullet("Reporting module — JasperReports reports and PDF bills."),
  h2("5.4 User Interface Design"),
  p("Screens were designed visually with the NetBeans GUI builder and styled with FlatLaf. Each maintenance screen presents a data table and a form with Save, Update, Reset, and Close actions. Selecting a table row loads it into the form for editing. The dashboard offers single-click navigation to each module. (Insert screenshots of the Login, Dashboard, Product, and Order screens here in the final report.)"),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 6. Implementation ------------------------------------------------------
const impl = [
  h1("6. Implementation"),
  h2("6.1 Overview"),
  p("The system is implemented as a NetBeans/Ant Java project. Each screen is a Swing JFrame paired with a NetBeans .form file. Custom Swing components (buttons, text fields, rounded panels, styled tables and scrollbars) give the application a consistent, modern appearance."),
  h2("6.2 Database Connectivity"),
  p("All database access goes through a single ConnetionProvider class implemented as a singleton. It opens a JDBC connection to the local MySQL server (schema pos_system) and supplies it to the screens on demand, reopening it if it has been closed. Every screen uses prepared statements for queries that involve user input, protecting against SQL injection, and releases result sets, statements, and connections after use."),
  h2("6.3 Order Processing"),
  p("The order screen demonstrates the core business logic. The operator picks a customer and adds products to a cart; the system checks available stock before each addition and maintains a running total. On save, the system deducts the ordered quantities from product stock, inserts a record into orderdetails with a unique order id, generates a PDF bill, and opens it for printing."),
  h2("6.4 Reporting and Bills"),
  p("Customer and user reports are produced with JasperReports, which fills pre-compiled report templates with live data and displays them in a viewer. Sales bills are generated as PDF files using OpenPDF/iText and then opened with the default PDF viewer. Missing report templates are handled gracefully with an error message rather than a crash."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 7. Testing -------------------------------------------------------------
const testing = [
  h1("7. Testing"),
  h2("7.1 Testing Approach"),
  p("Each module was tested manually as it was completed, using both valid and invalid inputs to confirm correct behaviour and proper error handling. The table below lists representative test cases and their results."),
  h2("7.2 Test Cases"),
  gridTable(
    ["#", "Test Case", "Expected Result", "Status"],
    [
      ["1", "Login with valid active admin credentials", "Dashboard opens", "Pass"],
      ["2", "Login with wrong password", "‘Incorrect Email or Password’ message", "Pass"],
      ["3", "Login with inactive user", "Access denied", "Pass"],
      ["4", "Add product with all fields", "Product saved and listed", "Pass"],
      ["5", "Add product with a missing field", "‘All fields are required’ message", "Pass"],
      ["6", "Add to cart exceeding stock", "Out-of-stock message; item not added", "Pass"],
      ["7", "Add same product twice to cart", "‘Product already exists in the cart’ message", "Pass"],
      ["8", "Save order", "Stock deducted, order recorded, PDF bill opens", "Pass"],
      ["9", "Update customer details", "Name, mobile, and email all updated", "Pass"],
      ["10", "Generate customer/user report", "Report displays; clear message if template missing", "Pass"],
    ],
    [600, 3760, 4000, 1000]
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 8. Conclusion ----------------------------------------------------------
const conclusion = [
  h1("8. Conclusion and Future Work"),
  h2("8.1 Conclusion"),
  p("The POS & Inventory Management System successfully meets its objectives. It provides authenticated access, maintains products, categories, customers, and users, processes sales with automatic stock control, and produces bills and reports. The dashboard gives the shop owner an immediate view of business activity and low-stock items. The project demonstrates practical application of Java desktop development, relational database design, and software-engineering practice."),
  h2("8.2 Future Work"),
  bullet("Externalise database credentials and store passwords as salted hashes."),
  bullet("Introduce multiple user roles with finer-grained permissions."),
  bullet("Add sales analytics and date-range sales reports."),
  bullet("Make the bill output folder configurable and support non-Windows platforms."),
  bullet("Add barcode scanning for faster product selection."),
  bullet("Support data backup and restore."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 9. References ----------------------------------------------------------
const references = [
  h1("9. References"),
  numItem("Oracle. Java Platform, Standard Edition 17 Documentation. Oracle Corporation."),
  numItem("Oracle. MySQL 8.0 Reference Manual. Oracle Corporation."),
  numItem("FlatLaf — Flat Look and Feel for Java Swing. FormDev Software."),
  numItem("JasperReports Library Documentation. Cloud Software Group / TIBCO."),
  numItem("OpenPDF / iText PDF Library Documentation."),
  numItem("K. E. Wiegers and J. Beatty. Software Requirements, 3rd ed. Microsoft Press."),
  numItem("Apache NetBeans Documentation. Apache Software Foundation."),
];

// ---- Assemble ---------------------------------------------------------------
const doc = new Document({
  creator: "«Your Full Name»",
  title: "Project Report — " + TITLE,
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "1F3F66" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E5C8A" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 120, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "pbul",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ] },
      { reference: "pnum",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "[%1]", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 420 } } } },
        ] },
    ],
  },
  sections: [{
    properties: { page: {
      size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
    } },
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "2E5C8A", space: 1 } },
      children: [new TextRun({ text: TITLE + " — Project Report", size: 16, color: "777777" })],
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "2E5C8A", space: 1 } },
      children: [
        new TextRun({ text: "«Your Name»", size: 16, color: "777777" }),
        new TextRun({ text: "\tPage ", size: 16, color: "777777" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "777777" }),
        new TextRun({ text: " of ", size: 16, color: "777777" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "777777" }),
      ],
    })] }) },
    children: [
      ...titlePage, ...declaration, ...ack, ...abstract, ...toc,
      ...intro, ...existing, ...method, ...analysis, ...design,
      ...impl, ...testing, ...conclusion, ...references,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("Project Document written:", process.argv[2]);
});
