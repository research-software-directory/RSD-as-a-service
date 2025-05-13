// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Init {

	private static final Logger LOGGER = LoggerFactory.getLogger(Init.class);

	private Init() {
	}

	static void checkConfigAndPrintStatus() {
		for (OpenidProvider openidProvider : OpenidProvider.values()) {
			switch (Config.accessMethodOfProvider(openidProvider)) {
				case MISCONFIGURED -> {
					LOGGER.warn("Provider {} is misconfigured", openidProvider.toUserFriendlyString());
				}
				case DISABLED -> {
					LOGGER.info("Provider {} is disabled", openidProvider.toUserFriendlyString());
				}
				case INVITE_ONLY -> {
					LOGGER.info("Provider {} is enabled with invites only", openidProvider.toUserFriendlyString());
				}
				case EVERYONE -> {
					if (openidProvider == OpenidProvider.local) {
						LOGGER.warn("********************");
						LOGGER.warn("Warning: local accounts are enabled, this is not safe for production!");
						LOGGER.warn("********************");
					} else {
						LOGGER.info("Provider {} is enabled for everyone", openidProvider.toUserFriendlyString());
					}
				}
			}
		}
	}
}
