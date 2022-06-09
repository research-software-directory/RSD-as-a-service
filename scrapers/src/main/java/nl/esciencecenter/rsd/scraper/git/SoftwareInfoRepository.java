// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<RepositoryUrlData> languagesData(int limit);

	Collection<RepositoryUrlData> licenseData(int limit);

	Collection<RepositoryUrlData> commitData(int limit);

	void save(Collection<RepositoryUrlData> data);
}
