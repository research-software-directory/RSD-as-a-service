// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonElement;

public class Utils {

	public static String jsonElementToString(JsonElement elementToConvert) {
		if (elementToConvert == null || elementToConvert.isJsonNull()) return null;
		if (!elementToConvert.isJsonPrimitive()) return null;
		return elementToConvert.getAsString();
	}
}
