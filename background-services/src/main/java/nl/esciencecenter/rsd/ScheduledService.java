// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.time.Duration;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * ScheduledServices are executed clock time-based
 */
public class ScheduledService extends AbstractService {

	private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
	private final LocalTime scheduleTime;
	private final Runnable task;

	public ScheduledService(LocalTime scheduleTime, Runnable task, String serviceName) {
		super(serviceName);
		this.scheduleTime = scheduleTime;
		this.task = task;
	}

	public ScheduledService(LocalTime scheduleTime, String command, String serviceName) {
		super(serviceName);
		this.scheduleTime = scheduleTime;
		this.task = new PostgresRunnable(command);
	}

	@Override
	public void run() {
		logger.info("Scheduling periodic service {} for {}", this.getServiceName(), scheduleTime);
		scheduleNextRun();
	}

	@Override
	public void terminate() {
		scheduler.shutdown();
	}

	private void performTask() {
		logger.info("{}: Performing scheduled task", this.getServiceName());
		task.run();

		scheduleNextRun();
	}

	private void scheduleNextRun() {
		long delay = calculateDelayUntilNextSchedule();
		logger.info("Delay till execution for {}: {}", this.getServiceName(), delay);
		scheduler.schedule(this::performTask, delay, TimeUnit.SECONDS);
	}

	private long calculateDelayUntilNextSchedule() {
		ZonedDateTime now = ZonedDateTime.now();
		ZonedDateTime nextRun = now.with(scheduleTime);
		if (!nextRun.isAfter(now.plusSeconds(1))) {
			nextRun = nextRun.plusDays(1);
		}
		return Duration.between(now, nextRun).getSeconds();
	}
}
