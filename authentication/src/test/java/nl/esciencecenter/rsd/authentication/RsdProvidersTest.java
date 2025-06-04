// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Map;

class RsdProvidersTest {

	@Test
	void whenGivenNullOrEmptyString_whenParsingAuthConfig_thenEmptyMapReturned() {
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> emptyMap = RsdProviders.parseAuthProvidersEnvString(null);
		Assertions.assertTrue(emptyMap.isEmpty());

		emptyMap = RsdProviders.parseAuthProvidersEnvString("");
		Assertions.assertTrue(emptyMap.isEmpty());
	}

	@Test
	void whenGivenValidConfig_whenParsingAuthConfig_thenCorrectMapReturned() {
		String authConfig = "SURFCONEXT:EVERYONE;HELMHOLTZ:INVITE_ONLY;ORCID:INVITE_ONLY;AZURE:EVERYONE";
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = RsdProviders.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(4, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.azure).accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.helmholtz)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());

		Assertions.assertTrue(authMap.get(OpenidProvider.surfconext).order() < authMap.get(OpenidProvider.helmholtz)
			.order());
		Assertions.assertTrue(authMap.get(OpenidProvider.helmholtz).order() < authMap.get(OpenidProvider.orcid)
			.order());
		Assertions.assertTrue(authMap.get(OpenidProvider.orcid).order() < authMap.get(OpenidProvider.azure).order());
	}

	@Test
	void whenGivenConfigWithDuplicates_whenParsingAuthConfig_thenDuplicatesAreMisconfigured() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;SURFCONEXT:EVERYONE";
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = RsdProviders.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());
	}

	@Test
	void whenGivenConfigWithNonExistingKey_whenParsingAuthConfig_thenThoseAreSkipped() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;DOESNOTEXIST:EVERYONE";
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = Assertions.assertDoesNotThrow(() -> RsdProviders.parseAuthProvidersEnvString(authConfig));

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());
	}

	@Test
	void whenGivenConfigWithNonExistingValue_whenParsingAuthConfig_thenThoseAreMisconfigured() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;AZURE:MISTAKE;LOCAL:";
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = RsdProviders.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(4, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.azure)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.local)
			.accessMethod());

		authConfig = "SURFCONEXT:EVERYONE:INVITE_ONLY;ORCID:INVITE_ONLY";
		authMap = RsdProviders.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());
	}

	@Test
	void whenGivenConfigWithMissingValue_whenParsingAuthConfig_thenThoseAreMisconfigured() {
		String authConfig = "SURFCONEXT;ORCID:INVITE_ONLY;AZURE:EVERYONE";
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = RsdProviders.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(3, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid)
			.accessMethod());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.azure).accessMethod());
	}

	@ParameterizedTest
	@ValueSource(strings = {
		";",
		";;;",
		":",
		":::",
		";:",
		":;",
		";;::;;:;;;;::",
		"::;;;;:;;;:;;;;:;;:;:;:;",
		"a=b;c=d:e=f",
	})
	void whenGivenMisconfiguredConfig_whenParsingAuthConfig_thenNoExceptionThrown(String authConfig) {
		Map<OpenidProvider, RsdProviders.OpenidProviderAccessMethodOrder> authMap = Assertions.assertDoesNotThrow(() -> RsdProviders.parseAuthProvidersEnvString(authConfig));
		Assertions.assertTrue(authMap.isEmpty());
	}
}
