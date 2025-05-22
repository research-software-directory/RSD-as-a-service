// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.nassa;

import nl.esciencecenter.rsd.scraper.RsdResponseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;
import java.util.regex.Pattern;

public class NassaReadmeParser {

	static Pattern furtherInfoPattern = Pattern.compile("## Further information\\s+");

	static String getLongDescriptionFromReadme(String content) throws RsdNassaParseException {
		Objects.requireNonNull(content);

		String[] split = furtherInfoPattern.split(content);
		if (split.length == 2) {
			return split[1];
		}

		throw new RsdNassaParseException("Couldn't split description into two parts around expected header, resulting array has size %d instead of 2".formatted(split.length));
	}

	public static String downloadAndReturnDescriptionFromReadme(URI readmeUri, HttpClient client) throws IOException, InterruptedException, RsdResponseException, RsdNassaParseException {
		HttpRequest request = HttpRequest.newBuilder(readmeUri).build();

		HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
		if (response.statusCode() >= 300) {
			throw new RsdResponseException(response.statusCode(), readmeUri, response.body(), "Unexpected response getting NASSA README");
		}

		return getLongDescriptionFromReadme(response.body());
	}
}
