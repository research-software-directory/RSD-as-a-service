// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Semaphore;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

/**
 * A thread safe throttler which will never allow more than N invocations per X time units.
 * It only accounts for the start of an action, not the duration of the action.
 * Actions that go over the limit are not rejected but delayed and executed when possible.
 */
public class Throttler {

	private final Semaphore semaphore;
	private final long xTimeUnits;
	private final TimeUnit timeUnit;
	private final ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor(
		runnable -> {
			ThreadFactory defaultFactory = Executors.defaultThreadFactory();
			Thread t = defaultFactory.newThread(runnable);
			t.setDaemon(true);
			return t;
		}
	);

	/**
	 * Create a new Throttler that will allow N invocations per X time units, in accordance with the supplied arguments.
	 *
	 * @param amountPerXTimeUnits the amount of invocations per X time units
	 * @param xTimeUnits          how many time units can contain N invocations
	 * @param timeUnit            the time unit of this throttler
	 */
	public Throttler(int amountPerXTimeUnits, long xTimeUnits, TimeUnit timeUnit) {
		semaphore = new Semaphore(amountPerXTimeUnits, true);
		this.xTimeUnits = xTimeUnits;
		this.timeUnit = timeUnit;
	}

	/**
	 * A blocking call that will return when you can do an action according to this throttler.
	 * It is up to the caller to take the action afterwards as soon as possible.
	 *
	 * @throws InterruptedException when interrupted while waiting
	 */
	public void awaitPermission() throws InterruptedException {
		semaphore.acquire();
		releaseFuturePermit();
	}

	/**
	 * A non-blocking call that will run the submitted action as soon as this throttler allows for it.
	 *
	 * @param task            the action that should be throttled
	 * @param executorService the thread pool in which the action should run
	 * @param <V>             the return type of the action
	 * @return the Future representing the running action
	 */
	public <V> Future<V> runThrottledTask(Callable<V> task, ExecutorService executorService) {
		Callable<V> wrappedTask = () -> {
			semaphore.acquire();
			releaseFuturePermit();
			return task.call();
		};

		return executorService.submit(wrappedTask);
	}

	private void releaseFuturePermit() {
		scheduledExecutorService.schedule(() -> semaphore.release(), xTimeUnits, timeUnit);
	}
}
