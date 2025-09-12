// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import java.util.Collections;
import nl.esciencecenter.rsd.authentication.accesstoken.RsdParseException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class GithubLoginTest {

	@ParameterizedTest
	@ValueSource(
		strings = {
			"access_token=ca81a679-97d7-4bc9-b6fd-b6b2e98db3b7&scope=&token_type=bearer",
			"scope=&token_type=bearer&access_token=ca81a679-97d7-4bc9-b6fd-b6b2e98db3b7",
		}
	)
	void givenValidAccessTokenResponse_whenParsing_thenAccessTokenReturned(String body) {
		String accessToken = Assertions.assertDoesNotThrow(() -> GithubLogin.extractAccessToken(body));

		Assertions.assertEquals("ca81a679-97d7-4bc9-b6fd-b6b2e98db3b7", accessToken);
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "a=b", "a=b&c=d", "access_token=&a=b" })
	void givenInvalidAccessTokenResponse_whenParsing_thenExceptionThrown(String body) {
		Assertions.assertThrowsExactly(RsdParseException.class, () -> GithubLogin.extractAccessToken(body));
	}

	@Test
	void givenValidUserInfo_whenParsing_thenOpenidInfoReturned() {
		// example from https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
		// editorconfig-checker-disable
		String body = """
			{
			  "login": "octocat",
			  "id": 1,
			  "node_id": "MDQ6VXNlcjE=",
			  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
			  "gravatar_id": "",
			  "url": "https://api.github.com/users/octocat",
			  "html_url": "https://github.com/octocat",
			  "followers_url": "https://api.github.com/users/octocat/followers",
			  "following_url": "https://api.github.com/users/octocat/following{/other_user}",
			  "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
			  "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
			  "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
			  "organizations_url": "https://api.github.com/users/octocat/orgs",
			  "repos_url": "https://api.github.com/users/octocat/repos",
			  "events_url": "https://api.github.com/users/octocat/events{/privacy}",
			  "received_events_url": "https://api.github.com/users/octocat/received_events",
			  "type": "User",
			  "site_admin": false,
			  "name": "monalisa octocat",
			  "company": "GitHub",
			  "blog": "https://github.com/blog",
			  "location": "San Francisco",
			  "email": "octocat@github.com",
			  "hireable": false,
			  "bio": "There once was...",
			  "twitter_username": "monatheoctocat",
			  "public_repos": 2,
			  "public_gists": 1,
			  "followers": 20,
			  "following": 0,
			  "created_at": "2008-01-14T04:33:35Z",
			  "updated_at": "2008-01-14T04:33:35Z",
			  "private_gists": 81,
			  "total_private_repos": 100,
			  "owned_private_repos": 100,
			  "disk_usage": 10000,
			  "collaborators": 8,
			  "two_factor_authentication": true,
			  "plan": {
			    "name": "Medium",
			    "space": 400,
			    "private_repos": 20,
			    "collaborators": 0
			  }
			}""";
		// editorconfig-checker-enable

		OpenIdInfo parsedInfo = Assertions.assertDoesNotThrow(() -> GithubLogin.extractUserInfo(body));

		Assertions.assertEquals("1", parsedInfo.sub());
		Assertions.assertEquals("monalisa octocat", parsedInfo.name());
		Assertions.assertEquals("octocat@github.com", parsedInfo.email());
		Assertions.assertEquals("GitHub", parsedInfo.organisation());
		Assertions.assertEquals(Collections.emptyMap(), parsedInfo.data());
	}

	@Test
	void givenValidUserInfoWithMissingData_whenParsing_thenOpenidInfoReturned() {
		// example edited from https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
		// editorconfig-checker-disable
		String body = """
			{
			  "login": "octocat",
			  "id": 1,
			  "node_id": "MDQ6VXNlcjE=",
			  "avatar_url": "https://github.com/images/error/octocat_happy.gif",
			  "gravatar_id": "",
			  "url": "https://api.github.com/users/octocat",
			  "html_url": "https://github.com/octocat",
			  "followers_url": "https://api.github.com/users/octocat/followers",
			  "following_url": "https://api.github.com/users/octocat/following{/other_user}",
			  "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
			  "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
			  "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
			  "organizations_url": "https://api.github.com/users/octocat/orgs",
			  "repos_url": "https://api.github.com/users/octocat/repos",
			  "events_url": "https://api.github.com/users/octocat/events{/privacy}",
			  "received_events_url": "https://api.github.com/users/octocat/received_events",
			  "type": "User",
			  "site_admin": false,
			  "name": null,
			  "company": null,
			  "blog": "https://github.com/blog",
			  "location": "San Francisco",
			  "email": null,
			  "hireable": false,
			  "bio": "There once was...",
			  "twitter_username": "monatheoctocat",
			  "public_repos": 2,
			  "public_gists": 1,
			  "followers": 20,
			  "following": 0,
			  "created_at": "2008-01-14T04:33:35Z",
			  "updated_at": "2008-01-14T04:33:35Z",
			  "private_gists": 81,
			  "total_private_repos": 100,
			  "owned_private_repos": 100,
			  "disk_usage": 10000,
			  "collaborators": 8,
			  "two_factor_authentication": true,
			  "plan": {
			    "name": "Medium",
			    "space": 400,
			    "private_repos": 20,
			    "collaborators": 0
			  }
			}""";
		// editorconfig-checker-enable

		OpenIdInfo parsedInfo = Assertions.assertDoesNotThrow(() -> GithubLogin.extractUserInfo(body));

		Assertions.assertEquals("1", parsedInfo.sub());
		Assertions.assertNull(parsedInfo.name());
		Assertions.assertNull(parsedInfo.email());
		Assertions.assertNull(parsedInfo.organisation());
		Assertions.assertEquals(Collections.emptyMap(), parsedInfo.data());
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "[]", "{}", "{\"name\": \"My Name\"}", "{\"id\": null}" })
	void givenInvalidUserInfoWithMissingData_whenParsing_thenExceptionThrown(String body) {
		Assertions.assertThrowsExactly(RsdParseException.class, () -> GithubLogin.extractUserInfo(body));
	}
}
