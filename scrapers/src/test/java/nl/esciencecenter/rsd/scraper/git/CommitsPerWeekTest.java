// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.reflect.TypeToken;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.time.Period;
import java.util.Map;

class CommitsPerWeekTest {

	@Test
	void givenInstance_whenValidOperations_thenCorrectResults() {
		CommitsPerWeek commitsPerWeek = new CommitsPerWeek();
		Map<Instant, Long> underlyingMap;

		Instant sundayMidnight1 = Instant.ofEpochSecond(1670716800);
		commitsPerWeek.addCommits(sundayMidnight1, 10);

		underlyingMap = commitsPerWeek.getData();
		Assertions.assertEquals(1, underlyingMap.size());
		Assertions.assertTrue(underlyingMap.containsKey(sundayMidnight1));
		Assertions.assertEquals(10, underlyingMap.get(sundayMidnight1));


		commitsPerWeek.addCommits(sundayMidnight1, 20);

		underlyingMap = commitsPerWeek.getData();
		Assertions.assertEquals(1, underlyingMap.size());
		Assertions.assertTrue(underlyingMap.containsKey(sundayMidnight1));
		Assertions.assertEquals(30, underlyingMap.get(sundayMidnight1));


		Instant smallTimeAfterSundayMidnight1 = sundayMidnight1.plus(Duration.ofDays(3))
			.plus(Duration.ofSeconds(12345));
		commitsPerWeek.addCommits(smallTimeAfterSundayMidnight1, 10);

		underlyingMap = commitsPerWeek.getData();
		Assertions.assertEquals(1, underlyingMap.size());
		Assertions.assertTrue(underlyingMap.containsKey(sundayMidnight1));
		Assertions.assertEquals(40, underlyingMap.get(sundayMidnight1));


		Instant sundayMidnight2 = sundayMidnight1.plus(Period.ofWeeks(5));
		commitsPerWeek.addCommits(sundayMidnight2, 5);

		underlyingMap = commitsPerWeek.getData();
		Assertions.assertEquals(2, underlyingMap.size());
		Assertions.assertTrue(underlyingMap.containsKey(sundayMidnight2));
		Assertions.assertEquals(5, underlyingMap.get(sundayMidnight2));
		Assertions.assertEquals(40, underlyingMap.get(sundayMidnight1));


		commitsPerWeek.addMissingZeros();
		underlyingMap = commitsPerWeek.getData();
		Assertions.assertEquals(6, underlyingMap.size());
		Assertions.assertEquals(0, underlyingMap.get(sundayMidnight1.plus(Period.ofWeeks(1))));
		Assertions.assertEquals(0, underlyingMap.get(sundayMidnight1.plus(Period.ofWeeks(2))));
		Assertions.assertEquals(0, underlyingMap.get(sundayMidnight1.plus(Period.ofWeeks(3))));
		Assertions.assertEquals(0, underlyingMap.get(sundayMidnight1.plus(Period.ofWeeks(4))));
		Assertions.assertEquals(40, underlyingMap.get(sundayMidnight1));
		Assertions.assertEquals(5, underlyingMap.get(sundayMidnight2));

	}

	@Test
	void givenInstance_whenValidOperations_thenCorrectJsonProduced() {
		Gson gson = new GsonBuilder()
			.registerTypeAdapter(Instant.class, (JsonDeserializer<Instant>) (json, typeOfT, context) -> Instant.ofEpochSecond(Long.parseLong(json.getAsString())))
			.create();
		TypeToken<Map<Instant, Long>> mapTypeToken = new TypeToken<>() {
		};
		CommitsPerWeek commitsPerWeek = new CommitsPerWeek();

		Map<Instant, Long> shouldBeEmptyMap = gson.fromJson(commitsPerWeek.toJson(), mapTypeToken.getType());
		Assertions.assertTrue(shouldBeEmptyMap.isEmpty());

		Instant sundayMidnight1 = Instant.ofEpochSecond(1670716800);
		commitsPerWeek.addCommits(sundayMidnight1, 10);
		commitsPerWeek.addCommits(sundayMidnight1, 20);

		Instant smallTimeAfterSundayMidnight1 = sundayMidnight1.plus(Duration.ofDays(3))
			.plus(Duration.ofSeconds(12345));
		commitsPerWeek.addCommits(smallTimeAfterSundayMidnight1, 10);

		Instant sundayMidnight2 = sundayMidnight1.plus(Period.ofWeeks(5));
		commitsPerWeek.addCommits(sundayMidnight2, 5);


		Map<Instant, Long> dataFromJson = gson.fromJson(commitsPerWeek.toJson(), mapTypeToken.getType());
		Assertions.assertEquals(2, dataFromJson.size());
		Assertions.assertEquals(40, dataFromJson.get(sundayMidnight1));
		Assertions.assertEquals(5, dataFromJson.get(sundayMidnight2));

		commitsPerWeek.addMissingZeros();
		dataFromJson = gson.fromJson(commitsPerWeek.toJson(), new TypeToken<Map<Instant, Long>>() {
		}.getType());
		Assertions.assertEquals(6, dataFromJson.size());
		Assertions.assertEquals(0, dataFromJson.get(sundayMidnight1.plus(Period.ofWeeks(1))));
		Assertions.assertEquals(0, dataFromJson.get(sundayMidnight1.plus(Period.ofWeeks(2))));
		Assertions.assertEquals(0, dataFromJson.get(sundayMidnight1.plus(Period.ofWeeks(3))));
		Assertions.assertEquals(0, dataFromJson.get(sundayMidnight1.plus(Period.ofWeeks(4))));
		Assertions.assertEquals(40, dataFromJson.get(sundayMidnight1));
		Assertions.assertEquals(5, dataFromJson.get(sundayMidnight2));
	}
}
