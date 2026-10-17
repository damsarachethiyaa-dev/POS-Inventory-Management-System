package JIAT.Connetion;

import java.io.File;

public class InventoryUtils {

    // A guaranteed-writable reports directory, resolved once at startup.
    private static final String REPORT_DIR = resolveReportDir();

    // Kept for backward compatibility with existing callers (bills, PdfOpener).
    public static final String BILL_PATH = REPORT_DIR;

    private static String resolveReportDir() {
        // Prefer D:\Reports\ when a D: drive exists and is writable.
        File dRoot = new File("D:\\");
        if (dRoot.exists()) {
            File d = new File("D:\\Reports\\");
            try {
                if (!d.exists()) {
                    d.mkdirs();
                }
                if (d.exists() && d.canWrite()) {
                    return "D:\\Reports\\";
                }
            } catch (Exception ignored) {
            }
        }
        // Fallback: <user home>\Documents\POS_Reports\  (always writable for the user).
        File fallback = new File(System.getProperty("user.home"), "Documents" + File.separator + "POS_Reports");
        if (!fallback.exists()) {
            fallback.mkdirs();
        }
        return fallback.getAbsolutePath() + File.separator;
    }

    /** Returns the writable reports directory, with a trailing separator. */
    public static String getReportDir() {
        return REPORT_DIR;
    }

    public static void ensureBillDirectory() {
        File dir = new File(REPORT_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }
}
