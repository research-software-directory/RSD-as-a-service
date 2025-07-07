package nl.esciencecenter;

import io.restassured.http.Header;
import java.util.UUID;

public class Commons {

	static final Header requestEntry = new Header("Prefer", "return=representation");

	static String createUUID() {
		return UUID.randomUUID().toString();
	}
}
