// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

import nl.esciencecenter.rsd.scraper.RsdResponseException;

import java.io.IOException;

public class FourTuScraper implements PackageManagerScraper {
	@Override
	public Long downloads() throws IOException, RsdResponseException {
		throw new UnsupportedOperationException();
	}

	@Override
	public Integer reverseDependencies() throws IOException, InterruptedException, RsdResponseException {
		throw new UnsupportedOperationException();
	}
}
