// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;
import java.util.Map;

class MainTest {
	Map<String, List<String>> emptyData = Collections.emptyMap();
	OpenIdInfo userinfo = new OpenIdInfo(
		"12345", "User Name", "user@example.com", "Example User", emptyData
	);
	OpenIdInfo userinfoNullOrganisation = new OpenIdInfo(
		"12345", "User Name", "user@example.com", null, emptyData
	);
	static MockedStatic<Config> utilities;

	@BeforeAll
	static void init() {
		utilities = Mockito.mockStatic(Config.class);
	}

	@AfterAll
	static void cleanup() {
		utilities.close();
	}
}
