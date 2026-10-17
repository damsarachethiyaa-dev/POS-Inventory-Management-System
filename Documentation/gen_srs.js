const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, PageBreak, TableOfContents, TabStopType, TabStopPosition,
} = require("docx");

// ---- Reusable helpers -------------------------------------------------------
const TITLE = "POS & Inventory Management System";
const CONTENT_W = 9360; // US Letter, 1" margins

const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, ...opts })] });
}
function bullet(text, level = 0) {
  return new Paragraph({ numbering: { reference: "bullets", level }, children: [new TextRun(text)] });
}
function req(tag, text) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: tag + ": ", bold: true }), new TextRun(text)],
  });
}
function shadedCell(text, w, fill, bold = false) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA }, margins: cellMargins,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, bold })] })],
  });
}
// Simple 2-col table from [label, value] rows
function infoTable(rows, w1 = 3000) {
  const w2 = CONTENT_W - w1;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: rows.map(([a, b]) =>
      new TableRow({ children: [shadedCell(a, w1, "EAF1F8", true), shadedCell(b, w2, null)] })
    ),
  });
}
// Generic header+body table
function gridTable(headers, dataRows, colW) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => shadedCell(hd, colW[i], "2E5C8A", true)),
  });
  // white header text
  headRow.root[1] = headRow.root[1]; // no-op
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

// ---- Title page -------------------------------------------------------------
const titlePage = [
  new Paragraph({ spacing: { before: 1600, after: 120 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Software Requirements Specification", bold: true, size: 44 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: "for", italics: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: TITLE, bold: true, size: 36, color: "2E5C8A" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1000 },
    children: [new TextRun({ text: "Version 1.0", size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "Prepared by «Your Full Name»", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "«University / Institute — Department»", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "«Course / Module Name & Code»", size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
    children: [new TextRun({ text: "«Submission Date»", size: 24 })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- TOC --------------------------------------------------------------------
const toc = [
  h1("Table of Contents"),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- Revision history -------------------------------------------------------
const revision = [
  h1("Revision History"),
  gridTable(
    ["Name", "Date", "Reason For Changes", "Version"],
    [["«Your Name»", "«Date»", "Initial version", "1.0"]],
    [2600, 1600, 4160, 1000]
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 1. Introduction --------------------------------------------------------
const intro = [
  h1("1. Introduction"),
  h2("1.1 Purpose"),
  p("This Software Requirements Specification (SRS) describes the functional and non-functional requirements of the POS & Inventory Management System, Version 1.0. The system is a desktop point-of-sale and inventory-control application that allows a retail business to manage products, categories, customers, system users, and sales orders, and to generate printable bills and reports. This document covers the complete system as currently implemented."),
  h2("1.2 Document Conventions"),
  p("This document follows the IEEE-830 / Karl Wiegers SRS template. Each functional requirement is uniquely tagged in the form REQ-<feature>-<number>. Where a requirement has its own priority, it is stated explicitly; otherwise requirements inherit the priority of their parent feature. Bold text marks requirement identifiers and key terms. Database object names are written in monospace style (e.g., product, CategoryFK)."),
  h2("1.3 Intended Audience and Reading Suggestions"),
  p("This SRS is intended for the following readers:"),
  bullet("Developers — to understand what must be built and maintained."),
  bullet("Project supervisor / evaluators — to assess scope and completeness of the academic project."),
  bullet("Testers — to derive test cases from the functional requirements in Section 3."),
  bullet("Future maintainers — to understand the system before extending it."),
  p("New readers should begin with Section 2 (Overall Description) for a high-level view, then read Section 3 (System Features) for detailed behaviour. Sections 4 and 5 cover interfaces and quality attributes."),
  h2("1.4 Project Scope"),
  p("The POS & Inventory Management System is a self-contained, single-organisation desktop application. Its goal is to replace manual, paper-based sales and stock record-keeping with a reliable computerised system. Core benefits include accurate real-time stock counts, faster billing, low-stock visibility, and structured customer and user records. The system is built as a campus project to demonstrate the application of Java desktop development, relational database design, and software-engineering practices."),
  h2("1.5 References"),
  bullet("IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications."),
  bullet("Karl E. Wiegers, Software Requirements Specification Template, Process Impact (www.processimpact.com)."),
  bullet("Oracle, Java Platform SE 17 Documentation."),
  bullet("MySQL 8.0 Reference Manual, Oracle Corporation."),
  bullet("FlatLaf, JasperReports, and OpenPDF/iText library documentation."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 2. Overall Description -------------------------------------------------
const overall = [
  h1("2. Overall Description"),
  h2("2.1 Product Perspective"),
  p("The product is a new, self-contained desktop application. It is not part of a larger product family. It follows a classic three-tier logical structure: a Java Swing presentation layer, application logic embedded in the form classes, and a MySQL relational database accessed through JDBC. A single connection provider (singleton) mediates all database access. The diagram below summarises the major components."),
  gridTable(
    ["Layer", "Components", "Responsibility"],
    [
      ["Presentation (UI)", "Login, Home, ManageProduct, ManageCategory, ManageCustomer, ManageOder, ManegeUsers, ViewOrders + custom Swing components", "Render screens, capture user input, display data and messages"],
      ["Application logic", "Event handlers inside each form; PdfGenerator, report helpers", "Validation, business rules, bill/report generation"],
      ["Data access", "ConnetionProvider (JDBC singleton)", "Open and supply MySQL connections"],
      ["Database", "MySQL schema pos_system", "Persist users, customers, products, categories, orders"],
    ],
    [2200, 4160, 3000]
  ),
  h2("2.2 Product Features"),
  p("The major features of the system are summarised below; each is detailed in Section 3:"),
  bullet("User authentication and role-based access."),
  bullet("Dashboard with live product, customer, and order counts and a low-stock list."),
  bullet("Product management (create, update, list) with category linkage."),
  bullet("Category management."),
  bullet("Customer management (create, update, list)."),
  bullet("Order / sales processing with a shopping cart, stock validation, and automatic stock deduction."),
  bullet("System-user management with status and roles."),
  bullet("Report generation (customer and user reports) and printable PDF bills."),
  h2("2.3 User Classes and Characteristics"),
  gridTable(
    ["User Class", "Characteristics", "Privileges"],
    [
      ["Administrator", "Trusted staff with full knowledge of the system; manages master data", "All features including user management and reports"],
      ["Cashier / Operator", "Day-to-day staff processing sales; basic computer literacy", "Login, dashboard, process orders, manage customers and products"],
    ],
    [2400, 4560, 2400]
  ),
  p("Note: in the current implementation all valid users are created with the role ‘Admin’. Role-based hiding of the User-management screen is supported by the Home screen and can be extended to additional roles."),
  h2("2.4 Operating Environment"),
  bullet("Operating system: Microsoft Windows 10 / 11 (the bill-opening feature uses Windows shell commands)."),
  bullet("Java Runtime: Java SE 17 or later."),
  bullet("Database: MySQL Server 8.x, default instance on localhost:3306, schema pos_system."),
  bullet("Display: minimum 1366×768 resolution recommended."),
  bullet("Disk: a writable reports folder (currently D:\\Reports\\) for generated PDF bills."),
  h2("2.5 Design and Implementation Constraints"),
  bullet("The application must be developed in Java (Swing) and built with the NetBeans/Ant project structure."),
  bullet("All persistent data must be stored in a MySQL relational database accessed via JDBC."),
  bullet("Third-party libraries are fixed by the project: FlatLaf (look-and-feel), JasperReports (reports), OpenPDF/iText (PDF bills), and the MySQL Connector/J driver."),
  bullet("Database credentials are presently compiled into the connection provider; for production this should move to external configuration (see Issues List)."),
  bullet("The PDF auto-open feature relies on the Windows ‘start’ command and is therefore platform-specific."),
  h2("2.6 User Documentation"),
  bullet("This SRS and the accompanying Project Document."),
  bullet("A short user guide describing login, order processing, and report generation (to be delivered with the final submission)."),
  bullet("In-application message dialogs that guide the user through validation and errors."),
  h2("2.7 Assumptions and Dependencies"),
  bullet("A MySQL server with the pos_system schema and seed data is installed and reachable before the application starts."),
  bullet("At least one valid Admin user record exists so that login is possible."),
  bullet("The host machine has a PDF viewer associated with the .pdf extension for bill viewing."),
  bullet("The required JAR dependencies are present on the application classpath."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 3. System Features -----------------------------------------------------
function feature(num, name, priority, desc, sr, reqs) {
  const out = [h2(`3.${num} ${name}`)];
  out.push(h3(`3.${num}.1 Description and Priority`));
  out.push(p(desc));
  out.push(p(`Priority: ${priority}.`, { italics: true }));
  out.push(h3(`3.${num}.2 Stimulus/Response Sequences`));
  sr.forEach((s) => out.push(bullet(s)));
  out.push(h3(`3.${num}.3 Functional Requirements`));
  reqs.forEach(([t, b]) => out.push(req(t, b)));
  return out;
}

const features = [
  h1("3. System Features"),
  p("The functional requirements are organised by system feature — the major services the product provides."),
  ...feature(1, "User Authentication", "High",
    "Allows a registered user to sign in with an email and password. Only active administrators may enter the system. On success the main dashboard opens; on failure an error message is shown.",
    ["User enters email and password and clicks Login.",
     "System validates the credentials against the user table.",
     "If a matching active Admin record is found, the Home dashboard is displayed; otherwise an ‘Incorrect Email or Password’ message is shown.",
     "User clicks Cancel to confirm and exit the application."],
    [["REQ-AUTH-1", "The system shall authenticate a user by matching the entered email and password against the user table."],
     ["REQ-AUTH-2", "The system shall grant access only to users whose UserRole is ‘Admin’ and whose Status is ‘Active’."],
     ["REQ-AUTH-3", "The system shall display a clear error message and remain on the login screen when credentials are invalid."],
     ["REQ-AUTH-4", "The system shall release all database resources (result set, statement, connection) after each login attempt."],
     ["REQ-AUTH-5", "The system shall allow the user to exit the application from the login screen after a confirmation prompt."]]),
  ...feature(2, "Dashboard (Home)", "High",
    "Presents a summary of the business: total products, total customers, and total orders, together with a list of products whose stock is running low, and navigation buttons to every other module.",
    ["User logs in successfully.",
     "System queries counts and the low-stock product list and renders them.",
     "User clicks a navigation button to open the corresponding module."],
    [["REQ-DASH-1", "The system shall display the current total number of products, customers, and orders."],
     ["REQ-DASH-2", "The system shall display a table of products whose Quantity is below the low-stock threshold (currently 50)."],
     ["REQ-DASH-3", "The system shall provide navigation to Order, Customer, Product, Category, User, and View-Orders screens, plus Logout."],
     ["REQ-DASH-4", "The system shall hide the User-management button for users who are not administrators."]]),
  ...feature(3, "Product Management", "High",
    "Lets the administrator add new products, update existing product details, and view all products with their category. Each product belongs to a category and has a stock quantity, price, and description.",
    ["User opens the Product screen; the system lists all products.",
     "User fills the form and clicks Save to add a product, or selects a row, edits fields and clicks Update.",
     "System validates input, writes to the product table, and refreshes the list."],
    [["REQ-PROD-1", "The system shall allow creation of a product with name, quantity, price, description, and category."],
     ["REQ-PROD-2", "The system shall require all product fields before saving a new product."],
     ["REQ-PROD-3", "The system shall allow updating a product’s name, price, description, and category (quantity is not editable during update)."],
     ["REQ-PROD-4", "The system shall display all products joined with their category name."],
     ["REQ-PROD-5", "The system shall populate the category selector from the category table."]]),
  ...feature(4, "Category Management", "Medium",
    "Lets the administrator maintain the list of product categories used to classify products.",
    ["User opens the Category screen.",
     "User adds or edits a category and saves.",
     "System persists the change to the category table."],
    [["REQ-CAT-1", "The system shall allow creation and editing of product categories."],
     ["REQ-CAT-2", "The system shall make categories available to the product module for selection."]]),
  ...feature(5, "Customer Management", "High",
    "Lets the administrator record and maintain customer details (name, mobile number, email) used during order processing and for reporting.",
    ["User opens the Customer screen; the system lists all customers.",
     "User adds a new customer or selects one and updates it.",
     "System validates and writes to the customer table, then refreshes the list."],
    [["REQ-CUST-1", "The system shall allow creation of a customer with name, mobile number, and email."],
     ["REQ-CUST-2", "The system shall require name, mobile number, and email before saving."],
     ["REQ-CUST-3", "The system shall allow updating a customer’s name, mobile number, and email."],
     ["REQ-CUST-4", "The system shall display all customers in a list."],
     ["REQ-CUST-5", "The system shall generate a printable customer report on request."]]),
  ...feature(6, "Order / Sales Processing", "High",
    "The core sales workflow. The operator selects a customer, adds products to a cart with quantities, the system checks stock and totals the bill, then on save it deducts stock, records the order, and generates a printable PDF bill.",
    ["Operator selects a customer from the customer list.",
     "Operator selects a product, enters a quantity, and clicks Add To Cart.",
     "System verifies available stock and adds the line to the cart, updating the running total.",
     "Operator clicks Save Order Details.",
     "System deducts stock, inserts the order, generates a PDF bill, opens it, and returns to the order screen."],
    [["REQ-ORD-1", "The system shall require a selected customer and at least one cart item before an order can be saved."],
     ["REQ-ORD-2", "The system shall verify that ordered quantity does not exceed available stock before adding an item to the cart."],
     ["REQ-ORD-3", "The system shall prevent the same product from being added to the cart twice."],
     ["REQ-ORD-4", "The system shall maintain and display a running total of the cart."],
     ["REQ-ORD-5", "The system shall allow removal of a cart line, adjusting the total accordingly."],
     ["REQ-ORD-6", "On save, the system shall deduct ordered quantities from product stock within the same transaction context."],
     ["REQ-ORD-7", "The system shall persist the order with a unique order id, customer, date, and total paid."],
     ["REQ-ORD-8", "The system shall generate and open a PDF bill for the completed order."],
     ["REQ-ORD-9", "The system shall release the database connection after the save operation completes or fails."]]),
  ...feature(7, "User Management", "Medium",
    "Lets the administrator create and update system-user accounts, including role, contact details, address, password, and active status.",
    ["Administrator opens the User screen; the system lists admin users.",
     "Administrator adds a user or selects one and updates details/status.",
     "System validates and writes to the user table."],
    [["REQ-USER-1", "The system shall allow creation of a user with name, mobile number, email, password, address, and status."],
     ["REQ-USER-2", "The system shall require all mandatory fields before saving a new user."],
     ["REQ-USER-3", "The system shall allow updating a user’s details and active/inactive status."],
     ["REQ-USER-4", "The system shall generate a printable user report on request."]]),
  ...feature(8, "Reporting and Bill Generation", "Medium",
    "Produces formatted reports and bills. Customer and user reports are rendered with JasperReports; sales bills are produced as PDF documents and opened for printing.",
    ["User clicks a report button (Customer Report / User Report) or completes an order.",
     "System loads the report template or builds the bill, fills it with data, and displays/opens it."],
    [["REQ-RPT-1", "The system shall generate a customer report and a user report from live database data."],
     ["REQ-RPT-2", "The system shall display a clear error message if a report template cannot be found, instead of failing silently."],
     ["REQ-RPT-3", "The system shall generate a PDF bill containing order id, date, line items, and total."],
     ["REQ-RPT-4", "The system shall store generated bills in a designated reports folder."]]),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 4. External Interfaces -------------------------------------------------
const external = [
  h1("4. External Interface Requirements"),
  h2("4.1 User Interfaces"),
  p("The user interface is a Windows desktop GUI built with Java Swing and themed with the FlatLaf flat look-and-feel. Common conventions apply across screens:"),
  bullet("Each maintenance screen offers Save, Update, Reset, and Close actions."),
  bullet("Tables present records; selecting a row loads it into the form for editing."),
  bullet("Validation failures and confirmations are shown through modal message dialogs."),
  bullet("The dashboard provides single-click navigation to every module."),
  p("Detailed screen layouts are defined by the NetBeans .form files and may be documented separately in a UI specification."),
  h2("4.2 Hardware Interfaces"),
  bullet("Standard desktop/laptop with keyboard, mouse, and display."),
  bullet("A printer (optional) for printing generated PDF bills and reports."),
  h2("4.3 Software Interfaces"),
  gridTable(
    ["Component", "Version", "Purpose / Data Exchanged"],
    [
      ["Java SE", "17", "Runtime platform"],
      ["MySQL", "8.x", "Persistent storage of all entities via SQL over JDBC"],
      ["MySQL Connector/J", "8.0.18", "JDBC driver translating SQL calls to the database"],
      ["JasperReports", "6.21.5", "Rendering of customer and user reports"],
      ["OpenPDF / iText", "1.3.30 / 2.1.7", "Generation of PDF bills"],
      ["FlatLaf", "3.6", "Swing look-and-feel"],
    ],
    [2600, 1800, 4960]
  ),
  h2("4.4 Communications Interfaces"),
  p("The application communicates with the MySQL server over the local TCP connection on port 3306 using the MySQL client/server protocol (JDBC URL with useSSL=false for the local development setup). No web, e-mail, or external network communication is required."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 5. Nonfunctional -------------------------------------------------------
const nonfunc = [
  h1("5. Other Nonfunctional Requirements"),
  h2("5.1 Performance Requirements"),
  bullet("Common screens (lists, dashboard) shall load within about 2 seconds for typical data volumes of a small shop (hundreds of records)."),
  bullet("Adding an item to the cart and saving an order shall complete within a few seconds, dominated by PDF generation."),
  bullet("The UI shall remain responsive; long operations shall not freeze the interface."),
  h2("5.2 Safety Requirements"),
  bullet("Stock deductions and order inserts shall be performed together so the database is not left in an inconsistent state if an error occurs."),
  bullet("Destructive actions (logout, exit, removing a cart line) shall require user confirmation."),
  h2("5.3 Security Requirements"),
  bullet("Access to the application shall require authentication."),
  bullet("Only active administrators shall be able to manage users and master data."),
  bullet("All SQL that uses user input shall use parameterised (prepared) statements to prevent SQL injection."),
  bullet("Database credentials should be stored outside the source code in a configuration file (recommended improvement)."),
  bullet("User passwords should be stored as salted hashes rather than plain text (recommended improvement)."),
  h2("5.4 Software Quality Attributes"),
  bullet("Usability: consistent screen layout and clear messages so staff can learn the system quickly."),
  bullet("Reliability: database resources are released after use and errors are reported, not swallowed."),
  bullet("Maintainability: code is organised by feature (one screen per module) with a single shared connection provider."),
  bullet("Portability: the Java/Swing core is cross-platform; only the PDF auto-open step is Windows-specific."),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---- 6. Other + Appendices --------------------------------------------------
const other = [
  h1("6. Other Requirements"),
  p("Database requirements: the system depends on the pos_system MySQL schema. The principal tables and their key columns are listed below."),
  gridTable(
    ["Table", "Key Columns", "Notes"],
    [
      ["user", "UserID (PK), UserRole, UserName, Email, Password, MobileNumber, Address, Status", "System users; login source"],
      ["customer", "CustomerID (PK), CustomerName, MobileNumber, Email", "Customers for orders/reports"],
      ["category", "CategoryID (PK), CategoryName", "Product classification"],
      ["product", "ProductID (PK), ProductName, Quantity, Price, Description, CategoryFK (FK→category)", "Inventory items"],
      ["orderdetails", "OrderID, CustomerID (FK), OrderDate, TatalPaid", "Recorded sales"],
    ],
    [1800, 5160, 2400]
  ),
  h1("Appendix A: Glossary"),
  gridTable(
    ["Term", "Definition"],
    [
      ["POS", "Point of Sale — the place and process where a sale is completed."],
      ["SRS", "Software Requirements Specification."],
      ["JDBC", "Java Database Connectivity — the API used to talk to MySQL."],
      ["Low-stock", "A product whose quantity has fallen below the configured threshold."],
      ["Cart", "The temporary list of products and quantities for the order being built."],
      ["Bill", "The PDF invoice generated when an order is saved."],
    ],
    [2400, 6960]
  ),
  h1("Appendix B: Analysis Models"),
  p("The logical data model links the entities as follows:"),
  bullet("A category has many products (category 1 — * product via CategoryFK)."),
  bullet("A customer has many orders (customer 1 — * orderdetails via CustomerID)."),
  bullet("An order records the customer, date, and total amount paid."),
  p("Suggested diagrams to attach to the final report: a use-case diagram (actors: Administrator, Cashier), an entity-relationship diagram of the five tables above, and an activity diagram of the order-processing workflow."),
  h1("Appendix C: Issues List"),
  bullet("Move database credentials from source code to an external configuration file. (Open)"),
  bullet("Replace plain-text password storage with hashed passwords. (Open)"),
  bullet("Extend role model beyond a single ‘Admin’ role if multiple privilege levels are required. (Open)"),
  bullet("Make the reports output folder configurable instead of the fixed D:\\Reports\\ path. (Open)"),
];

// ---- Assemble document ------------------------------------------------------
const doc = new Document({
  creator: "«Your Full Name»",
  title: "Software Requirements Specification — " + TITLE,
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
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
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
      children: [new TextRun({ text: "SRS — " + TITLE, size: 16, color: "777777" })],
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "2E5C8A", space: 1 } },
      children: [
        new TextRun({ text: "Version 1.0", size: 16, color: "777777" }),
        new TextRun({ text: "\tPage ", size: 16, color: "777777" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "777777" }),
        new TextRun({ text: " of ", size: 16, color: "777777" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "777777" }),
      ],
    })] }) },
    children: [
      ...titlePage, ...toc, ...revision, ...intro, ...overall,
      ...features, ...external, ...nonfunc, ...other,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("SRS written:", process.argv[2]);
});
