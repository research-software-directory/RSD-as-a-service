// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter;

import java.net.URI;
import java.util.UUID;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith({ SetupAllTests.class })
public class RepositoryUrlIntegrationTest {

	@Test
	void givenRepositoryUrl_whenAddingToSoftware_thenThisOnlySucceedsByMaintainerOrAdmin() {
		User softwareMaintainer = User.create(true);

		SoftwareMetadata softwareMetadata = softwareMaintainer.createSoftwareV1(
			"Software " + Commons.generateRandomShortString()
		);

		URI url = URI.create("https://www.example.com/" + Commons.generateRandomShortString());
		RepositoryUrl repositoryUrl = RepositoryUrl.createOrGet(softwareMaintainer, url);
		Assertions.assertEquals(
			201,
			repositoryUrl.addToSoftware(softwareMaintainer, UUID.fromString(softwareMetadata.id()))
		);

		User nonMaintainer = User.create(true);
		url = URI.create("https://www.example.com/" + Commons.generateRandomShortString());
		repositoryUrl = RepositoryUrl.createOrGet(softwareMaintainer, url);
		Assertions.assertEquals(
			403,
			repositoryUrl.addToSoftware(nonMaintainer, UUID.fromString(softwareMetadata.id()))
		);

		url = URI.create("https://www.example.com/" + Commons.generateRandomShortString());
		repositoryUrl = RepositoryUrl.createOrGet(softwareMaintainer, url);
		Assertions.assertEquals(401, repositoryUrl.addToSoftware(UUID.fromString(softwareMetadata.id())));
	}
}
