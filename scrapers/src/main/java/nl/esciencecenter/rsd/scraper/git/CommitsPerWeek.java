// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * Aggregates commits per week. We choose a week to begin on Sunday at midnight UTC, since GitHub aggregates commits at this instance too.
 * In the underlying map, we choose Sunday midnight UTC as a representative for a week as well.
 */
public class CommitsPerWeek {

	private final SortedMap<Instant, Long> data = new TreeMap<>();
	static final Gson gson = new GsonBuilder()
			.enableComplexMapKeySerialization()
			.registerTypeAdapter(Instant.class, (JsonSerializer<Instant>) (src, typeOfSrc, context) -> new JsonPrimitive(src.getEpochSecond()))
			.create();

	SortedMap<Instant, Long> getData() {
		return new TreeMap<>(data);
	}

	public void addCommits(ZonedDateTime zonedDateTime, long count) {
		ZonedDateTime utcTime = zonedDateTime.withZoneSameInstant(ZoneOffset.UTC);
		Instant sundayMidnight = utcTime.truncatedTo(ChronoUnit.DAYS).with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)).toInstant();
		data.merge(sundayMidnight, count, Long::sum);
	}

	public void addCommits(Instant instant, long count) {
		ZonedDateTime utcTime = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC);
		addCommits(utcTime, count);
	}

	public ZonedDateTime popLatestTimestamp() {
		if (this.data.size() > 0) {
			Instant lastTimeStamp = this.data.lastKey();
			this.data.remove(lastTimeStamp);
			return ZonedDateTime.ofInstant(lastTimeStamp, ZoneId.systemDefault());
		}
		return null;
	}

	/**
	 * Checks every week from the first week present to the last week. If a week is not present, puts zero for that week.
	 * We need these zero values so that the commit graphs are displayed properly.
	 */
	public void addMissingZeros() {
		if (data.isEmpty()) return;

		Instant firstWeek = data.firstKey();
		Instant lastWeek = data.lastKey();

		for (Instant currentWeek = firstWeek; currentWeek.isBefore(lastWeek); currentWeek = currentWeek.plus(Period.ofWeeks(1))) {
			data.putIfAbsent(currentWeek, 0L);
		}
	}

	public String toJson() {
		return gson.toJson(data);
	}
}
