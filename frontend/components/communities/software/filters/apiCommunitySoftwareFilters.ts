// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger';
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers';
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter';
import {buildSoftwareFilter} from '~/components/software/overview/filters/softwareFiltersApi';
import {LicensesFilterOption} from '~/components/filter/LicensesFilter';
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter';
import {CommunityRequestStatus} from '../apiCommunitySoftware';

export type CommunitySoftwareFilterProps = {
	id: string;
	software_status: CommunityRequestStatus;
	search?: string | null;
	keywords?: string[] | null;
	prog_lang?: string[] | null;
	licenses?: string[] | null;
	token?: string;
};

export function buildCommunitySoftwareFilter({
	id,
	software_status,
	search,
	keywords,
	prog_lang,
	licenses,
}: CommunitySoftwareFilterProps) {
	const filter = {
		// additional organisation filter
		community_id: id,
		software_status,
		// add default software filter params
		...buildSoftwareFilter({
			search,
			keywords,
			prog_lang,
			licenses,
		}),
	};
	// console.group('buildCommunitySoftwareFilter')
	// console.log('filter...', filter)
	// console.groupEnd()
	return filter;
}

export async function comSoftwareKeywordsFilter({
	id,
	software_status,
	search,
	keywords,
	prog_lang,
	licenses,
	token,
}: CommunitySoftwareFilterProps) {
	try {
		const query = 'rpc/com_software_keywords_filter?order=keyword';
		const url = `${getBaseUrl()}/${query}`;
		const filter = buildCommunitySoftwareFilter({
			id,
			software_status,
			search,
			keywords,
			prog_lang,
			licenses,
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
			`comSoftwareKeywordsFilter: ${resp.status} ${resp.statusText}`,
			'warn',
		);
		return [];
	} catch (e: any) {
		logger(`comSoftwareKeywordsFilter: ${e?.message}`, 'error');
		return [];
	}
}

export async function comSoftwareLanguagesFilter({
	id,
	software_status,
	search,
	keywords,
	prog_lang,
	licenses,
	token,
}: CommunitySoftwareFilterProps) {
	try {
		const query = 'rpc/com_software_languages_filter?order=prog_language';
		const url = `${getBaseUrl()}/${query}`;
		const filter = buildCommunitySoftwareFilter({
			id,
			software_status,
			search,
			keywords,
			prog_lang,
			licenses,
		});

		const resp = await fetch(url, {
			method: 'POST',
			headers: createJsonHeaders(token),
			// we pass params in the body of POST
			body: JSON.stringify(filter),
		});

		if (resp.status === 200) {
			const json: LanguagesFilterOption[] = await resp.json();
			return json;
		}

		logger(
			`comSoftwareLanguagesFilter: ${resp.status} ${resp.statusText}`,
			'warn',
		);
		return [];
	} catch (e: any) {
		logger(`comSoftwareLanguagesFilter: ${e?.message}`, 'error');
		return [];
	}
}

export async function comSoftwareLicensesFilter({
	id,
	software_status,
	search,
	keywords,
	prog_lang,
	licenses,
	token,
}: CommunitySoftwareFilterProps) {
	try {
		const query = 'rpc/com_software_licenses_filter?order=license';
		const url = `${getBaseUrl()}/${query}`;
		const filter = buildCommunitySoftwareFilter({
			id,
			software_status,
			search,
			keywords,
			prog_lang,
			licenses,
		});

		const resp = await fetch(url, {
			method: 'POST',
			headers: createJsonHeaders(token),
			// we pass params in the body of POST
			body: JSON.stringify(filter),
		});

		if (resp.status === 200) {
			const json: LicensesFilterOption[] = await resp.json();
			return json;
		}

		logger(
			`comSoftwareLicensesFilter: ${resp.status} ${resp.statusText}`,
			'warn',
		);
		return [];
	} catch (e: any) {
		logger(`comSoftwareLicensesFilter: ${e?.message}`, 'error');
		return [];
	}
}
