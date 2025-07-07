// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

public class PostgresCustomException extends Exception {

	public PostgresCustomException(String message) {
		super(message);
	}

	public static class PostgresAccessTokenExpirationException extends PostgresCustomException {

		public PostgresAccessTokenExpirationException(String message) {
			super(message);
		}
	}
}
