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

class ConfigTest {

	@Test
	void whenGivenNullOrEmptyString_whenParsingAuthConfig_thenEmptyMapReturned() {
		Map<OpenidProvider, OpenidProviderAccessMethod> emptyMap = Config.parseAuthProvidersEnvString(null);
		Assertions.assertTrue(emptyMap.isEmpty());

		emptyMap = Config.parseAuthProvidersEnvString("");
		Assertions.assertTrue(emptyMap.isEmpty());
	}

	@Test
	void whenGivenValidConfig_whenParsingAuthConfig_thenCorrectMapReturned() {
		String authConfig = "SURFCONEXT:EVERYONE;HELMHOLTZ:INVITE_ONLY;ORCID:INVITE_ONLY;AZURE:EVERYONE";
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(4, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.azure));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.helmholtz));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
	}

	@Test
	void whenGivenConfigWithDuplicates_whenParsingAuthConfig_thenDuplicatesAreMisconfigured() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;SURFCONEXT:EVERYONE";
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
	}

	@Test
	void whenGivenConfigWithNonExistingKey_whenParsingAuthConfig_thenThoseAreSkipped() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;DOESNOTEXIST:EVERYONE";
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
	}

	@Test
	void whenGivenConfigWithNonExistingValue_whenParsingAuthConfig_thenThoseAreMisconfigured() {
		String authConfig = "SURFCONEXT:EVERYONE;ORCID:INVITE_ONLY;AZURE:MISTAKE;LOCAL:";
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(4, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.azure));
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.local));

		authConfig = "SURFCONEXT:EVERYONE:INVITE_ONLY;ORCID:INVITE_ONLY";
		authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(2, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
	}

	@Test
	void whenGivenConfigWithMissingValue_whenParsingAuthConfig_thenThoseAreMisconfigured() {
		String authConfig = "SURFCONEXT;ORCID:INVITE_ONLY;AZURE:EVERYONE";
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Config.parseAuthProvidersEnvString(authConfig);

		Assertions.assertEquals(3, authMap.size());
		Assertions.assertEquals(OpenidProviderAccessMethod.MISCONFIGURED, authMap.get(OpenidProvider.surfconext));
		Assertions.assertEquals(OpenidProviderAccessMethod.INVITE_ONLY, authMap.get(OpenidProvider.orcid));
		Assertions.assertEquals(OpenidProviderAccessMethod.EVERYONE, authMap.get(OpenidProvider.azure));
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
		Map<OpenidProvider, OpenidProviderAccessMethod> authMap = Assertions.assertDoesNotThrow(() -> Config.parseAuthProvidersEnvString(authConfig));
		Assertions.assertTrue(authMap.isEmpty());
	}
}
