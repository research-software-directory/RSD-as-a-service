// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

	private static final String VIEW_NAME = "count_software_mentions_cached";

	public static void main(String[] args) {
		Logger logger = LoggerFactory.getLogger(MainDatabase.class);

		Runnable runnable = () -> {
			String dbHost = System.getenv("POSTGRES_DB_HOST");
			String dbPort = System.getenv("POSTGRES_DB_HOST_PORT");
			String dbName = System.getenv("POSTGRES_DB");
			String dbUrl = "jdbc:postgresql://%s:%s/%s".formatted(dbHost, dbPort, dbName);
			String dbUsername = System.getenv("POSTGRES_USER");
			String dbPassword = System.getenv("POSTGRES_PASSWORD");
			try (
					Connection connection = DriverManager.getConnection(dbUrl, dbUsername, dbPassword);
					Statement statement = connection.createStatement()
			) {
				statement.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY %s;".formatted(VIEW_NAME));
			} catch (SQLException e) {
				throw new RuntimeException(e);
			}
		};

		try (ScheduledExecutorService runner = Executors.newSingleThreadScheduledExecutor()) {
			int initialDelay = 30;
			int delay = 300;
			ScheduledFuture<?> future = runner.scheduleWithFixedDelay(runnable, initialDelay, delay, TimeUnit.SECONDS);
			future.get();
		} catch (ExecutionException e) {
			logger.error("Something went wrong updating the materialized view \"%s\"".formatted(VIEW_NAME), e);
		} catch (InterruptedException e) {
			logger.error("Got interrupted when updating the materialized view \"%s\"".formatted(VIEW_NAME), e);
			Thread.currentThread().interrupt();
		}
	}
}
