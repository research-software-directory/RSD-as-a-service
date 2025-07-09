// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.Collection;

public class JsonErrorMessageCreator {

	public static String createErrorJson(String message, Collection<String> details) {
		JsonObject errorObject = new JsonObject();

		errorObject.addProperty("message", message);

		JsonArray detailsArray = new JsonArray(details.size());
		for (String detail : details) {
			detailsArray.add(detail);
		}

		errorObject.add("details", detailsArray);

		return errorObject.toString();
	}
}
