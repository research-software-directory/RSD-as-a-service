// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * PeriodicServices are executed at a fixed rate based on an interval
 */
public class PeriodicService extends AbstractService {

	private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
	private final Duration interval;
	private final Duration initialDelay;
	private final Runnable task;

	public PeriodicService(Duration interval, Duration initialDelay, Runnable task, String serviceName) {
		super(serviceName);
		this.interval = interval;
		this.initialDelay = initialDelay;
		this.task = task;
	}

	public PeriodicService(Duration interval, Duration initialDelay, String command, String serviceName) {
		super(serviceName);
		this.interval = interval;
		this.initialDelay = initialDelay;
		this.task = new PostgresRunnable(command);
	}

	@Override
	public void run() {
		logger.info(
			"Scheduling periodic service {} with {}s delay, {}s interval",
			this.getServiceName(),
			initialDelay.toSeconds(),
			interval.toSeconds()
		);
		scheduler.scheduleAtFixedRate(
			this::performTask,
			initialDelay.toSeconds(),
			interval.toSeconds(),
			TimeUnit.SECONDS
		);
	}

	@Override
	public void terminate() {
		scheduler.shutdown();
	}

	private void performTask() {
		logger.info("{}: Performing periodic task", this.getServiceName());
		task.run();
	}
}
