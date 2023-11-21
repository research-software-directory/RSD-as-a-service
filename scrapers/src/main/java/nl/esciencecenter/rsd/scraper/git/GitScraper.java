// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.io.IOException;

public interface GitScraper {

	BasicGitData basicData() throws IOException, InterruptedException;

	String languages() throws IOException, InterruptedException;

	CommitsPerWeek contributions() throws IOException, InterruptedException;

	Integer contributorCount() throws IOException, InterruptedException;
}
