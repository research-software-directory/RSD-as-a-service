// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PostgresRunnable implements Runnable {

	private final String command;
	protected final Logger LOGGER = LoggerFactory.getLogger(getClass().getName());

	public PostgresRunnable(String command) {
		this.command = command;
	}

	@Override
	public void run() {
		String dbHost = System.getenv("POSTGRES_DB_HOST");
		String dbPort = System.getenv("POSTGRES_DB_HOST_PORT");
		String dbName = System.getenv("POSTGRES_DB");
		String dbUrl = "jdbc:postgresql://%s:%s/%s".formatted(dbHost, dbPort, dbName);
		String dbUsername = System.getenv("POSTGRES_USER");
		String dbPassword = System.getenv("POSTGRES_PASSWORD");
		try (
			Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
			Statement statement = connection.createStatement();
		) {
			statement.execute(command);
		} catch (SQLException e) {
			LOGGER.error("SQLException", e);
		}
	}
}
