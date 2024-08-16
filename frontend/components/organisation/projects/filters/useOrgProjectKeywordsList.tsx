// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {useSession} from '~/auth';
import logger from '~/utils/logger';
import {decodeJsonParam} from '~/utils/extractQueryParam';
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers';
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter';
import useOrganisationContext from '../../context/useOrganisationContext';
import useProjectParams from '../useProjectParams';
import {buildProjectFilter} from '~/components/projects/overview/filters/projectFiltersApi';

export type OrgProjectFilterProps = {
	id: string;
	search?: string | null;
	project_status?: string | null;
	keywords?: string[] | null;
	domains?: string[] | null;
	organisations?: string[] | null;
	token?: string;
};

type OrgProjectFilterApiProps = {
	organisation_id: string;
	search_filter?: string;
	keyword_filter?: string[];
	research_domain_filter?: string[];
	organisation_filter?: string[];
};

export function buildOrgProjectFilter({
	id,
	search,
	project_status,
	keywords,
	domains,
	organisations,
}: OrgProjectFilterProps) {
	const filter: OrgProjectFilterApiProps = {
		// additional organisation filter
		organisation_id: id,
		// add default project filter params
		...buildProjectFilter({
			search,
			keywords,
			domains,
			organisations,
			project_status,
		}),
	};
	// console.group('buildOrgProjectFilter')
	// console.log('filter...', filter)
	// console.groupEnd()
	return filter;
}

export async function orgProjectKeywordsFilter({
	id,
	search,
	project_status,
	keywords,
	domains,
	organisations,
	token,
}: OrgProjectFilterProps) {
	try {
		const query = 'rpc/org_project_keywords_filter?order=keyword';
		const url = `${getBaseUrl()}/${query}`;
		const filter = buildOrgProjectFilter({
			id,
			search,
			keywords,
			domains,
			organisations,
			project_status,
		});

		const resp = await fetch(url, {
			method: 'POST',
			headers: createJsonHeaders(token),
			// we pass params in the body of POST
			body: JSON.stringify(filter),
		});

		if (resp.status === 200) {
			const json: KeywordFilterOption[] = await resp.json();
			return json;
		}

		logger(
			`orgProjectKeywordsFilter: ${resp.status} ${resp.statusText}`,
			'warn',
		);
		return [];
	} catch (e: any) {
		logger(`orgProjectKeywordsFilter: ${e?.message}`, 'error');
		return [];
	}
}

export default function useOrgProjectKeywordsList() {
	const {token} = useSession();
	const {id} = useOrganisationContext();
	const {
		search,
		project_status,
		keywords_json,
		domains_json,
		organisations_json,
	} = useProjectParams();
	const [keywordsList, setKeywordsList] = useState<KeywordFilterOption[]>([]);

	// console.group('useOrgProjectKeywordsList')
	// console.log('id...', id)
	// console.log('search...', search)
	// console.log('keywords_json...', keywords_json)
	// console.log('domains_json...', domains_json)
	// console.log('organisations_json...', organisations_json)
	// console.log('keywordsList...', keywordsList)
	// console.groupEnd()

	useEffect(() => {
		let abort = false;
		if (id) {
			const keywords = decodeJsonParam(keywords_json, null);
			const domains = decodeJsonParam(domains_json, null);
			const organisations = decodeJsonParam(organisations_json, null);

			// get filter options
			orgProjectKeywordsFilter({
				id,
				search,
				keywords,
				domains,
				organisations,
				project_status,
				token,
			}).then(resp => {
				// abort
				if (abort) return;
				setKeywordsList(resp);
			});
		}
		return () => {
			// debugger
			abort = true;
		};
	}, [
		search,
		keywords_json,
		domains_json,
		organisations_json,
		id,
		token,
		project_status,
	]);

	return {
		keywordsList,
	};
}
