// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.time.Duration;
import java.time.LocalTime;

public class ServiceFactory {

	private ServiceFactory() {}

	public static Service createPeriodicService(
		String serviceName,
		Duration interval,
		Duration initialDelay,
		Runnable runnable
	) {
		return new PeriodicService(interval, initialDelay, runnable, serviceName);
	}

	public static Service createPeriodicService(
		String serviceName,
		Duration interval,
		Duration initialDelay,
		String command
	) {
		return new PeriodicService(interval, initialDelay, command, serviceName);
	}

	public static Service createScheduledService(String serviceName, LocalTime scheduledTime, Runnable runnable) {
		return new ScheduledService(scheduledTime, runnable, serviceName);
	}

	public static Service createScheduledService(String serviceName, LocalTime scheduledTime, String command) {
		return new ScheduledService(scheduledTime, command, serviceName);
	}
}
