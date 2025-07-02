// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractService implements Service {
	protected final Logger LOGGER = LoggerFactory.getLogger(getClass().getName());
	private final String serviceName;

	public AbstractService(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getServiceName() {
		return serviceName;
	}

	@Override
	public void start() {
		LOGGER.info("Starting service");
		run();
	}

	@Override
	public void stop() {
		LOGGER.info("Stopping service");
		terminate();
	}

	@Override
	public abstract void run();

	@Override
	public abstract void terminate();
}
