package JIAT.Common;

import java.awt.Desktop;
import java.io.File;
import javax.swing.JOptionPane;
import JIAT.Connetion.InventoryUtils;
import JIAT.Connetion.ConnetionProvider;

public class PdfOpener {

    public static void openPdf(String filePath) {
        try {
            File file = new File(filePath);

            if (!file.exists()) {
                JOptionPane.showMessageDialog(null, "PDF not found: " + file.getAbsolutePath());
                return;
            }

            // Use Windows shell start command to open PDF
            String cmd = "cmd /c start \"\" \"" + file.getAbsolutePath() + "\"";

            Process p = Runtime.getRuntime().exec(cmd);

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error opening PDF: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // **Helper method to open PDF by order ID**
    public static void openPdfByOrderId(String orderId) {
        String fileName;

        if (orderId.startsWith("Bill-")) {
            fileName = orderId;
        } else {
            fileName = "Bill-" + orderId;
        }

        String filePath = JIAT.Connetion.InventoryUtils.BILL_PATH + fileName + ".pdf";

        System.out.println("Trying to open PDF: " + filePath);
        openPdf(filePath);
    }

}
