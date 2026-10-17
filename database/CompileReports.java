import net.sf.jasperreports.engine.JasperCompileManager;

public class CompileReports {
    public static void main(String[] args) throws Exception {
        String base = args[0];
        String[] names = { "userReport", "customerReport" };
        for (String n : names) {
            JasperCompileManager.compileReportToFile(base + "/" + n + ".jrxml", base + "/" + n + ".jasper");
            System.out.println("Compiled: " + n + ".jasper");
        }
    }
}
