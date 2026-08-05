// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.escape_ossr;

import java.net.URI;
import nl.esciencecenter.rsd.scraper.doi.Doi;

public record ZenodoEntry(String id, Doi conceptDoi, URI filesLink) {}
