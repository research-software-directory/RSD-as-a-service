// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

public class RsdAccessTokenException extends Exception {

	public RsdAccessTokenException(String message) {
		super(message);
	}

	public RsdAccessTokenException(String message, Throwable cause) {
		super(message, cause);
	}

	public static class UnverifiedAccessTokenException extends RsdAccessTokenException {

		public UnverifiedAccessTokenException(String message) {
			super(message);
		}
	}
}
