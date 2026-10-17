package JIAT.Common;

import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.TextAlignment;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import JIAT.Connetion.InventoryUtils;

public class PdfGenerator {

    public static String generateBill(String orderId, int totalPaid, JTable cartTable) {
        String dest = InventoryUtils.BILL_PATH + orderId + ".pdf";

        try {
            InventoryUtils.ensureBillDirectory();

            PdfWriter writer = new PdfWriter(dest);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc);

            // Header
            doc.add(new Paragraph("Inventory Management System")
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));
            doc.add(new Paragraph("----------------------------------------------------------------------------"));

            // Order details
            String date = new SimpleDateFormat("dd-MM-yyyy").format(Calendar.getInstance().getTime());
            doc.add(new Paragraph("Order ID: " + orderId +
                    "\nDate: " + date +
                    "\nTotal Paid: Rs " + totalPaid));
            doc.add(new Paragraph("----------------------------------------------------------------------------"));

            // Table setup
            float[] widths = {120F, 160F, 80F, 80F, 100F};
            Table table = new Table(widths);
            DeviceRgb headerColor = new DeviceRgb(255, 204, 51);
            String[] headers = {"Name", "Description", "Price Per Unit", "Quantity", "Sub Total"};

            for (String h : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(h)).setBackgroundColor(headerColor));
            }

            // Table content
            DefaultTableModel model = (DefaultTableModel) cartTable.getModel();
            for (int i = 0; i < model.getRowCount(); i++) {
                table.addCell(model.getValueAt(i, 1).toString());
                table.addCell(model.getValueAt(i, 4).toString());
                table.addCell(model.getValueAt(i, 3).toString());
                table.addCell(model.getValueAt(i, 2).toString());
                table.addCell(model.getValueAt(i, 5).toString());
            }

            doc.add(table);
            doc.add(new Paragraph("----------------------------------------------------------------------------"));
            doc.add(new Paragraph("Thank you, please visit again").setTextAlignment(TextAlignment.CENTER));

            doc.close();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return dest;
    }
}
