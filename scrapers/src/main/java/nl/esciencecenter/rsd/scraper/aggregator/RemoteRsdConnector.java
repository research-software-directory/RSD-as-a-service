// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.aggregator;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.URI;

public class RemoteRsdConnector {

	private RemoteRsdConnector() {
	}

	public static JsonArray getAllSoftware(URI remoteDomain) throws RsdResponseException, IOException, InterruptedException {
		String path = "/api/v1/rpc/software_overview";
		String url = remoteDomain.toString() + path;

		String response = Utils.get(url);
		return JsonParser.parseString(response).getAsJsonArray();
	}
}
