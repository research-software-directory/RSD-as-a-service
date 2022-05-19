package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonElement;

public class Utils {

	public static String jsonElementToString(JsonElement elementToConvert) {
		if (elementToConvert == null || elementToConvert.isJsonNull()) return null;
		if (!elementToConvert.isJsonPrimitive()) return null;
		return elementToConvert.getAsString();
	}
}
