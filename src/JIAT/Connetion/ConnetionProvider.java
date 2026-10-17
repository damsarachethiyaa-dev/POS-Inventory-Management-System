package JIAT.Connetion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnetionProvider {

    private static ConnetionProvider instance;
    private Connection connection;


    private final String server = "localhost";
    private final String port = "3306";
    private final String database = "pos_system";
    private final String userName = "root";
    private final String password = "YOUR_DB_PASSWORD";

    private ConnetionProvider() {
        try {
            connectToDatabase();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static ConnetionProvider getInstance() {
        if (instance == null) {
            instance = new ConnetionProvider();
        }
        return instance;
    }

    private void connectToDatabase() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(
                "jdbc:mysql://" + server + ":" + port + "/" + database + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                userName,
                password
            );
            System.out.println("Database connected successfully.");
        }
    }

    public Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                connectToDatabase();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }
}