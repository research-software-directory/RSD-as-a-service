// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager.scrapers;

public class InvalidPackageManagerUrlException extends Exception {

	public InvalidPackageManagerUrlException(String message) {
		super(message);
	}
}
