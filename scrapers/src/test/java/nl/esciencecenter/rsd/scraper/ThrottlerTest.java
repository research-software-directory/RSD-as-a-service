// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ThrottlerTest {

	@Test
	void givenThrottlerWithFixedDelay_whenGettingTwoPermission_thenMinimumTimeRespected() throws InterruptedException {
		int millisecondsBetweenPermissions = 100;
		Throttler throttler = new Throttler(1, millisecondsBetweenPermissions, TimeUnit.MILLISECONDS);

		long tik = System.nanoTime();
		throttler.awaitPermission();
		throttler.awaitPermission();
		long tok = System.nanoTime();

		Assertions.assertTrue((tok - tik) / 1_000_000 >= millisecondsBetweenPermissions);
	}

	@Test
	void givenThrottlerWithRandomDelay_whenGettingTwoPermission_thenMinimumTimeRespected() throws InterruptedException {
		int min = 10;
		int max = 500;
		Random random = new Random();

		for (int i = 0; i < 10; i++) {
			int millisecondsBetweenPermissions = random.nextInt(max - min) + min;
			Throttler throttler = new Throttler(1, millisecondsBetweenPermissions, TimeUnit.MILLISECONDS);

			long tik = System.nanoTime();
			throttler.awaitPermission();
			throttler.awaitPermission();
			long tok = System.nanoTime();

			Assertions.assertTrue((tok - tik) / 1_000_000 >= millisecondsBetweenPermissions);
		}
	}

	@Disabled("This is for playing around with the Throttler class using prints, not for automated testing.")
	@Test
	void testThrottlerFuturesWithPrintStatements() {
		Throttler throttler = new Throttler(3, 1000, TimeUnit.MILLISECONDS);
		ExecutorService executorService = Executors.newSingleThreadExecutor();

		List<Future<Integer>> futures = new ArrayList<>();
		for (int i = 0; i < 10; i++) {
			int finalI = i;
			Future<Integer> task = throttler.runThrottledTask(() -> finalI, executorService);
			futures.add(task);
		}

		futures.forEach(f -> {
			try {
				System.out.println(f.get());
			} catch (InterruptedException | ExecutionException e) {
				throw new RuntimeException(e);
			}
		});
	}
}
