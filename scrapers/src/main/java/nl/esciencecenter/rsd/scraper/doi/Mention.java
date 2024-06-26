// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.io.IOException;

import nl.esciencecenter.rsd.scraper.RsdResponseException;

public interface Mention {

	MentionRecord mentionData() throws IOException, InterruptedException, RsdResponseException;
}
