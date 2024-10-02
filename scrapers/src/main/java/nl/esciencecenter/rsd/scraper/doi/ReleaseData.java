// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;
import java.util.UUID;

public class ReleaseData {

	public UUID softwareId;
	public String slug;
	public Doi conceptDoi;
	public Collection<Doi> versionedDois;

	@Override
	public String toString() {
		return "ReleaseData{" +
				"softwareId=" + softwareId +
				", slug='" + slug + '\'' +
				", conceptDoi='" + conceptDoi + '\'' +
				", versionedDois=" + versionedDois +
				'}';
	}
}
