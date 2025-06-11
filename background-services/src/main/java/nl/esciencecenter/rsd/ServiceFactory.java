// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.time.LocalTime;

public class ServiceFactory {
	public static Service createService(String type, String serviceName, Object... params) {
		switch (type) {
			case "periodic":
				if (params[2] instanceof Runnable runnable) {
					return new PeriodicService((int) params[0], (int) params[1], runnable, (String) serviceName);
				} else if (params[2] instanceof String string) {
					return new PeriodicService((int) params[0], (int) params[1], string, (String) serviceName);
				} else {
					throw new IllegalArgumentException("Invalid parameter type for periodic service %s".formatted(serviceName));
				}

			case "scheduled":
				if (params[1] instanceof Runnable runnable) {
					return new ScheduledService((LocalTime) params[0], runnable, serviceName);
				} else if (params[1] instanceof String string) {
					return new ScheduledService((LocalTime) params[0], string, serviceName);
				} else {
					throw new IllegalArgumentException("Invalid parameter type for scheduled service %s".formatted(serviceName));
				}
			default:
				throw new UnsupportedOperationException("Unsupported service type %s".formatted(type));
		}
	}
}
