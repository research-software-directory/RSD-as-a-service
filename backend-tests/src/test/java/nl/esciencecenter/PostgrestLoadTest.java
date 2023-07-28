// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.concurrent.*;

public class PostgrestLoadTest {

	public static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
			.followRedirects(HttpClient.Redirect.NORMAL)
			.build();

	record HttpResult(HttpResponse<?> response, long responseTime) {
	}

	@Test
	void givenNUsers_whenGettingOneSoftwareEverySecond_thenNoErrors() throws InterruptedException {
		final int users = 1000;
		final int duration = 30;
		final int maxRequests = users * (duration + 1);
		Collection<HttpResult> responses = new ConcurrentLinkedQueue<>();
		Collection<ScheduledFuture<?>> futures = new ArrayList<>(maxRequests);
		Runnable task = createTask(responses);
		ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(maxRequests);

		long start = System.currentTimeMillis();
		for (int t = 0; t <= duration; t++) {
			for (int i = 0; i < users; i++) {
				ScheduledFuture<?> future = scheduledExecutorService.schedule(task, t, TimeUnit.SECONDS);
				futures.add(future);
			}
		}

		scheduledExecutorService.shutdown();
//		boolean wasDone = scheduledExecutorService.awaitTermination(duration * 6, TimeUnit.SECONDS);
//		System.out.println("wasDone = " + wasDone);

		for (ScheduledFuture<?> future : futures) {
			try {
				future.get();
			} catch (ExecutionException e) {
				e.printStackTrace();
			}
		}
		long stop = System.currentTimeMillis();
		System.out.printf("Time taken: %d ms\n", stop - start);

		System.out.println("responses.size() = " + responses.size());

		long sumTime = 0;
		for (HttpResult result : responses) {
			System.out.printf("status: %d, time: %d\n", result.response.statusCode(), result.responseTime);
			sumTime += result.responseTime;
		}
		System.out.println("sumTime = " + sumTime);
	}

	static Runnable createTask(Collection<HttpResult> responses) {
		return () -> {
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("https://research-software.dev/api/v1/software?limit=1")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost/api/v1/")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost:3500/")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost/api/v1/software?limit=10")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost/api/v1/project?limit=10")).build();
			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost/api/v1/organisation?limit=10")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://localhost:3500/software?limit=10")).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create(System.getenv("POSTGREST_URL"))).build();
//			HttpRequest httpRequest = HttpRequest.newBuilder(URI.create(System.getenv("POSTGREST_URL") + "/software?limit=1")).build();
			HttpResponse<?> httpResponse;
			try {
				long start = System.currentTimeMillis();
				httpResponse = HTTP_CLIENT.send(httpRequest, HttpResponse.BodyHandlers.discarding());
				httpResponse.body();
				long stop = System.currentTimeMillis();
				responses.add(new HttpResult(httpResponse, stop - start));
			} catch (IOException | InterruptedException e) {
				throw new RuntimeException(e);
			}
		};
	}
}
