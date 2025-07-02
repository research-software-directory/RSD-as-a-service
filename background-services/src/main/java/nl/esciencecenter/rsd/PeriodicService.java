// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * PeriodicServices are executed at a fixed rate based on an interval
 */
public class PeriodicService extends AbstractService {
	private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
	private final int intervalSeconds;
	private final int initialDelay;
	private final Runnable task;

	public PeriodicService(int intervalSeconds, int initialDelay, Runnable task, String serviceName) {
		super(serviceName);
		this.intervalSeconds = intervalSeconds;
		this.initialDelay = initialDelay;
		this.task = task;
	}

	public PeriodicService(int intervalSeconds, int initialDelay, String command, String serviceName) {
		super(serviceName);
		this.intervalSeconds = intervalSeconds;
		this.initialDelay = initialDelay;
		this.task = new PostgresRunnable(command);
	}

	@Override
	public void run() {
		LOGGER.info("Scheduling periodic service %s with %s - %s".formatted(this.getServiceName(), initialDelay, intervalSeconds));
		scheduler.scheduleAtFixedRate(this::performTask, initialDelay, intervalSeconds, TimeUnit.SECONDS);
	}

	@Override
	public void terminate() {
		scheduler.shutdown();
	}

	private void performTask() {
		LOGGER.info("%s: Performing periodic task".formatted(this.getServiceName()));
		task.run();
	}
}
