// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class CodebergScraperTest {

	@Test
	void givenValidBasicDataJson_whenParsed_thenCorrectResultReturned() {
		// editorconfig-checker-disable
		String data = """
			{
			  "id": 43678,
			  "owner": {
			    "id": 48310,
			    "login": "privacyguides",
			    "login_name": "",
			    "source_id": 0,
			    "full_name": "Privacy Guides",
			    "email": "",
			    "avatar_url": "https://codeberg.org/avatars/ed2e53352d56adc4cf428df0f9e80913",
			    "html_url": "https://codeberg.org/privacyguides",
			    "language": "",
			    "is_admin": false,
			    "last_login": "0001-01-01T00:00:00Z",
			    "created": "2022-05-02T16:55:47+02:00",
			    "restricted": false,
			    "active": false,
			    "prohibit_login": false,
			    "location": "",
			    "pronouns": "",
			    "website": "https://privacyguides.org",
			    "description": "",
			    "visibility": "public",
			    "followers_count": 18,
			    "following_count": 0,
			    "starred_repos_count": 0,
			    "username": "privacyguides"
			  },
			  "name": "privacyguides.org",
			  "full_name": "privacyguides/privacyguides.org",
			  "description": "Mirror of https://github.com/privacyguides/privacyguides.org - Protect your data against global mass surveillance programs.",
			  "empty": false,
			  "private": false,
			  "fork": false,
			  "template": false,
			  "parent": null,
			  "mirror": false,
			  "size": 159315,
			  "language": "Markdown",
			  "languages_url": "https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org/languages",
			  "html_url": "https://codeberg.org/privacyguides/privacyguides.org",
			  "url": "https://codeberg.org/api/v1/repos/privacyguides/privacyguides.org",
			  "link": "",
			  "ssh_url": "ssh://git@codeberg.org/privacyguides/privacyguides.org.git",
			  "clone_url": "https://codeberg.org/privacyguides/privacyguides.org.git",
			  "original_url": "",
			  "website": "https://privacyguides.org",
			  "stars_count": 194,
			  "forks_count": 4,
			  "watchers_count": 18,
			  "open_issues_count": 0,
			  "open_pr_counter": 0,
			  "release_counter": 0,
			  "default_branch": "main",
			  "archived": false,
			  "created_at": "2022-05-02T17:34:40+02:00",
			  "updated_at": "2025-08-20T19:01:48+02:00",
			  "archived_at": "1970-01-01T01:00:00+01:00",
			  "permissions": {
			    "admin": false,
			    "push": false,
			    "pull": true
			  },
			  "has_issues": true,
			  "external_tracker": {
			    "external_tracker_url": "https://github.com/privacyguides/privacyguides.org/issues",
			    "external_tracker_format": "https://github.com/privacyguides/privacyguides.org/issues/{index}",
			    "external_tracker_style": "",
			    "external_tracker_regexp_pattern": ""
			  },
			  "has_wiki": false,
			  "wiki_branch": "master",
			  "globally_editable_wiki": false,
			  "has_pull_requests": true,
			  "has_projects": false,
			  "has_releases": false,
			  "has_packages": false,
			  "has_actions": false,
			  "ignore_whitespace_conflicts": false,
			  "allow_merge_commits": true,
			  "allow_rebase": true,
			  "allow_rebase_explicit": true,
			  "allow_squash_merge": true,
			  "allow_fast_forward_only_merge": false,
			  "allow_rebase_update": true,
			  "default_delete_branch_after_merge": false,
			  "default_merge_style": "squash",
			  "default_allow_maintainer_edit": false,
			  "default_update_style": "merge",
			  "avatar_url": "https://codeberg.org/repo-avatars/43678-266105cc5352d0f73a9c48abceab936b",
			  "internal": false,
			  "mirror_interval": "",
			  "object_format_name": "sha1",
			  "mirror_updated": "0001-01-01T00:00:00Z",
			  "repo_transfer": null,
			  "topics": []
			}""";
		// editorconfig-checker-enable

		BasicGitData parsedData = CodebergScraper.parseBasicData(data);

		Assertions.assertEquals(false, parsedData.archived());
		Assertions.assertNull(parsedData.license());
		Assertions.assertEquals(194, parsedData.starCount());
		Assertions.assertEquals(4, parsedData.forkCount());
		Assertions.assertEquals(0, parsedData.openIssueCount());
	}
}
