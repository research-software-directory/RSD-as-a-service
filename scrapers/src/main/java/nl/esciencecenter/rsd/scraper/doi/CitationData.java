// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.doi;

import java.util.Collection;
import java.util.UUID;

/** 
 * Container class for Citation information retrieved from the database.
 */
public class CitationData {

	// UUID of this entry in the database
	public final UUID id;
	
	// DOI of this entry.
	public final String doi;
	
	// List of known DOIs citing this entry.
	public final Collection<String> knownDois;
	
	/**
	 * Create a CitationData and initialize with data provided.
	 * 
	 * @param id of this entry in the database
	 * @param doi of this entry
	 * @param knownDois list of known DOIs citing this entry
	 */
	public CitationData(UUID id, String doi, Collection<String> knownDois) {
		super();
		this.id = id;
		this.doi = doi;
		this.knownDois = knownDois;
	}
}
