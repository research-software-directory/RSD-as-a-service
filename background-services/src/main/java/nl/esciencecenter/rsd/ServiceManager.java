// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd;

import java.util.ArrayList;
import java.util.List;

public class ServiceManager {

	private List<Service> services = new ArrayList<>();

	public void registerService(Service service) {
		services.add(service);
	}

	public void startAllServices() {
		services.forEach(Service::start);
	}

	public void stopAllServices() {
		services.forEach(Service::stop);
	}
}
