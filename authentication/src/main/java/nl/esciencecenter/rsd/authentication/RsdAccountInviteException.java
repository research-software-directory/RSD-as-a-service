// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

public class RsdAccountInviteException extends Exception {
	public RsdAccountInviteException(String message) {
		super(message);
	}

	public RsdAccountInviteException(String message, Throwable cause) {
		super(message, cause);
	}
}
