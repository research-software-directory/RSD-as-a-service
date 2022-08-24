// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

public class ResponseException extends RuntimeException {
	private Integer statusCode;

	public ResponseException(Integer statusCode) {
		this.statusCode = statusCode;
	}

	public ResponseException(Integer statusCode, String message) {
		super(message);
		this.statusCode = statusCode;
	}

	public Integer getStatusCode() {
		return this.statusCode;
	}
}
