// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class MainDatabase {

	public static void main(String[] args) throws SQLException, ExecutionException, InterruptedException {
		String dbName = System.getenv("POSTGRES_DB");
		String dbUsername = System.getenv("POSTGRES_USER");
		String dbPassword = System.getenv("POSTGRES_PASSWORD");
		String dbUrl = "jdbc:postgresql://localhost:5432/" + dbName;

		Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
		Statement statement = connection.createStatement();

		try (ScheduledExecutorService runner = Executors.newSingleThreadScheduledExecutor()) {
			Runnable runnable = () -> {
				try {
					statement.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY count_software_mentions_cached;");
				} catch (SQLException e) {
					e.printStackTrace();
				}
			};
			ScheduledFuture<?> future = runner.scheduleWithFixedDelay(runnable, 30, 60, TimeUnit.SECONDS);
			future.get();
		}
	}
}
