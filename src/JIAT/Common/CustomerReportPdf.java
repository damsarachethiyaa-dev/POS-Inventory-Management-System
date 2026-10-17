package JIAT.Common;

/**
 *
 * @author C.Damsara
 */
import JIAT.Connetion.ConnetionProvider;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import java.awt.Desktop;
import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Vector;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRTableModelDataSource;
import net.sf.jasperreports.view.JasperViewer;

public class CustomerReportPdf {

    private void loadReport() {

    }

    public static void generateCustomerReport(String filePath) {
        try {
            // Initialize PDF writer and document
            PdfWriter writer = new PdfWriter(filePath);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("Customer Report").setBold().setFontSize(18));

            // Create a table with 4 columns
            float[] columnWidths = {100, 150, 150, 200};
            Table table = new Table(columnWidths);
            table.addHeaderCell("Customer ID");
            table.addHeaderCell("Customer Name");
            table.addHeaderCell("Mobile Number");
            table.addHeaderCell("Email");

            // Fetch data from database
            Connection con = ConnetionProvider.getInstance().getConnection();
            PreparedStatement pst = con.prepareStatement("SELECT CustomerID, CustomerName, MobileNumber, Email FROM customer");
            ResultSet rs = pst.executeQuery();

            

            // Add rows to the table
            while (rs.next()) {
                
                table.addCell(rs.getString("CustomerID"));
                table.addCell(rs.getString("CustomerName"));
                table.addCell(rs.getString("MobileNumber"));
                table.addCell(rs.getString("Email"));
                
            }
            
            rs.close();
            pst.close();
            con.close();

            document.add(table);
            document.close();

            // Open PDF using Windows cmd
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
