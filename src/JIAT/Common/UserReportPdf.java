package JIAT.Common;

import JIAT.Connetion.ConnetionProvider;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import java.io.File;

public class UserReportPdf {

    public static void generateUserReport(String filePath) {
        try {
            PdfWriter writer = new PdfWriter(filePath);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("User Report").setBold().setFontSize(18));

            // Define 8 columns widths to match 8 headers
            float[] columnWidths = {70, 150, 100, 200, 100, 120, 80, 180};
            Table table = new Table(columnWidths);

            // Add header cells
            table.addHeaderCell("User ID");
            table.addHeaderCell("User Name");
            table.addHeaderCell("User Role");
            table.addHeaderCell("Email");
            table.addHeaderCell("Password");
            table.addHeaderCell("MobileNumber");
            table.addHeaderCell("Status");
            table.addHeaderCell("Address");

            // Fetch data from database
            try (var con = ConnetionProvider.getInstance().getConnection();
                 var pst = con.prepareStatement("SELECT UserID, UserName, UserRole, Email, Password, MobileNumber, Status, Address FROM user");
                 var rs = pst.executeQuery()) {

                while (rs.next()) {
                    table.addCell(rs.getString("UserID") == null ? "" : rs.getString("UserID"));
                    table.addCell(rs.getString("UserName") == null ? "" : rs.getString("UserName"));
                    table.addCell(rs.getString("UserRole") == null ? "" : rs.getString("UserRole"));
                    table.addCell(rs.getString("Email") == null ? "" : rs.getString("Email"));
                    table.addCell(rs.getString("Password") == null ? "" : rs.getString("Password"));
                    table.addCell(rs.getString("MobileNumber") == null ? "" : rs.getString("MobileNumber"));
                    table.addCell(rs.getString("Status") == null ? "" : rs.getString("Status"));
                    table.addCell(rs.getString("Address") == null ? "" : rs.getString("Address"));
                }
            }

            document.add(table);
            document.close();

            // Open PDF automatically on Windows using cmd start
            File file = new File(filePath);
            if (!file.exists()) {
                javax.swing.JOptionPane.showMessageDialog(null, "PDF not found: " + file.getAbsolutePath());
                return;
            }

            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                String cmd = "cmd /c start \"\" \"" + file.getAbsolutePath() + "\"";
                Runtime.getRuntime().exec(cmd);
            } else {
                javax.swing.JOptionPane.showMessageDialog(null, "Automatic PDF opening is only supported on Windows.");
            }

            System.out.println("PDF generated and opened successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            javax.swing.JOptionPane.showMessageDialog(null, "Error generating PDF: " + e.getMessage());
        }
    }
}
