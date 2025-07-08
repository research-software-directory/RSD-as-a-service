// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.time.LocalTime;

public class ServiceFactory {

	public static Service createPeriodicService(
		String serviceName,
		int intervalSeconds,
		int initialDelay,
		Runnable runnable
	) {
		return new PeriodicService(intervalSeconds, initialDelay, runnable, serviceName);
	}

	public static Service createPeriodicService(
		String serviceName,
		int intervalSeconds,
		int initialDelay,
		String command
	) {
		return new PeriodicService(intervalSeconds, initialDelay, command, serviceName);
	}

	public static Service createScheduledService(String serviceName, LocalTime scheduledTime, Runnable runnable) {
		return new ScheduledService(scheduledTime, runnable, serviceName);
	}

	public static Service createScheduledService(String serviceName, LocalTime scheduledTime, String command) {
		return new ScheduledService(scheduledTime, command, serviceName);
	}
}
