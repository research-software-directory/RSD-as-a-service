// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.UUID;

public record AccessToken(
	UUID id,
	String secret,
	String account,
	String createdAt,
	String expiresAt,
	String displayName
) {

}
