package JIAT.Component;

import java.awt.Color;
import java.awt.Component;
import javax.swing.DefaultCellEditor;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

public class Table extends JTable {

    public Table() {
        // Show horizontal and vertical grid lines
        setShowHorizontalLines(true);
        setShowVerticalLines(true);
        setGridColor(Color.BLACK);
        setRowHeight(40);

        // Disable column reordering
        getTableHeader().setReorderingAllowed(false);

        // Custom header renderer
        getTableHeader().setDefaultRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable jtable, Object value, boolean isSelected,
                                                           boolean hasFocus, int row, int column) {
                TableHeader header = new TableHeader(value + "");
                header.setBackground(Color.BLACK);
                header.setForeground(Color.WHITE);
                return header;
            }
        });

        // Custom cell renderer (keeps cell editable behavior intact)
        setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected,
                                                           boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                c.setBackground(Color.WHITE);
                c.setForeground(Color.BLACK);

                if (isSelected) {
                    c.setBackground(new Color(230, 230, 230));  // Light gray for selected cell
                }

                return c;
            }
        });

        // Enable default text editor for Object cells
        setDefaultEditor(Object.class, new DefaultCellEditor(new JTextField()));
    }

    // Add a new row to the table
    public void addRow(Object[] row) {
        DefaultTableModel model = (DefaultTableModel) getModel();
        model.addRow(row);
    }

    // Apply table fixes to JScrollPane
    public void fixTable(JScrollPane scroll) {
        scroll.setBorder(null);
        scroll.setVerticalScrollBar(new ScrollBar());
        scroll.getVerticalScrollBar().setBackground(Color.WHITE);
        scroll.getViewport().setBackground(Color.WHITE);
        JPanel p = new JPanel();
        p.setBackground(Color.WHITE);
        scroll.setCorner(JScrollPane.UPPER_RIGHT_CORNER, p);
    }
}
