// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication.accesstoken;

public class RsdParseException extends Exception {

	public RsdParseException(String message) {
		super(message);
	}

	public RsdParseException(String message, Throwable cause) {
		super(message, cause);
	}
}
