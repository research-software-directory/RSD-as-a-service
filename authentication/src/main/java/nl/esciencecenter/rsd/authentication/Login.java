// SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.io.IOException;

public interface Login {

	OpenIdInfo openidInfo() throws IOException, InterruptedException, RsdResponseException;
}
