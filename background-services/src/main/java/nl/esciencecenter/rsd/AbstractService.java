// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.util.logging.Logger;

public abstract class AbstractService implements Service {
	protected final Logger logger = Logger.getLogger(getClass().getName());
	private final String serviceName;

	public AbstractService(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getServiceName() {
		return serviceName;
	}

	@Override
	public void start() {
		logger.info("Starting service");
		run();
	}

	@Override
	public void stop() {
		logger.info("Stopping service");
		terminate();
	}

	@Override
	public abstract void run();

	@Override
	public abstract void terminate();
}
