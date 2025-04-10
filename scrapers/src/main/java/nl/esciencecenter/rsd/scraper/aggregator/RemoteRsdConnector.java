// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.aggregator;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.io.IOException;
import java.net.URI;
import java.util.StringJoiner;

public class RemoteRsdConnector {

	private static final String SELECT_LIST;

	static {
		// column `categories` from `software_overview()` is not in table `remote_software`
		StringJoiner selectListBuilder = new StringJoiner(",");
		selectListBuilder.add("id");
		selectListBuilder.add("slug");
		selectListBuilder.add("brand_name");
		selectListBuilder.add("short_statement");
		selectListBuilder.add("image_id");
		selectListBuilder.add("updated_at");
		selectListBuilder.add("contributor_cnt");
		selectListBuilder.add("mention_cnt");
		selectListBuilder.add("is_published");
		selectListBuilder.add("keywords");
		selectListBuilder.add("keywords_text");
		selectListBuilder.add("prog_lang");
		selectListBuilder.add("licenses");

		SELECT_LIST = selectListBuilder.toString();
	}

	private RemoteRsdConnector() {
	}

	public static JsonArray getAllSoftware(URI remoteDomain) throws RsdResponseException, IOException, InterruptedException {
		String path = "/api/v1/rpc/software_overview?select=" + SELECT_LIST;
		String url = remoteDomain.toString() + path;

		String response = Utils.get(url);
		return JsonParser.parseString(response).getAsJsonArray();
	}
}
