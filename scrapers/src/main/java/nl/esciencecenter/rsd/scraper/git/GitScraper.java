// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.io.IOException;

import nl.esciencecenter.rsd.scraper.RsdResponseException;

public interface GitScraper {

	BasicGitData basicData() throws IOException, InterruptedException, RsdResponseException;

	String languages() throws IOException, InterruptedException, RsdResponseException;

	CommitsPerWeek contributions() throws IOException, InterruptedException, RsdResponseException;

	Integer contributorCount() throws IOException, InterruptedException, RsdResponseException;
}
