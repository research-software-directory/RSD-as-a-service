package nl.esciencecenter;

import java.util.UUID;

import io.restassured.http.Header;

public class Commons {
	static final Header requestEntry = new Header("Prefer", "return=representation");

	static String createUUID() {
		return UUID.randomUUID().toString();
	}
}
