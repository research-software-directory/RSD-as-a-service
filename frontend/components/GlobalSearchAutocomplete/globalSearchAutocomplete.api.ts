// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger';
import {createJsonHeaders} from '~/utils/fetchHelpers';

export type GlobalSearchResults =
	| {
			slug: string;
			name: string;
			source: 'software' | 'projects' | 'organisations' | 'communities';
			is_published?: boolean;
			search_text?: string;
	  }
	| undefined;

/**
 *
 * @param searchText
 * @param token
 */
export async function getGlobalSearch(
	searchText: string,
	token: string,
): Promise<GlobalSearchResults[]> {
	try {
		// call the function query
		const query = `rpc/global_search?query=${searchText}&limit=30&order=rank.asc,index_found.asc`;
		let url = `/api/v1/${query}`;

		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				...createJsonHeaders(token),
			},
		});
		if (resp.status === 200) {
			// already sorted by the backend, see the query above
			return await resp.json();
		} else {
			throw new Error(
				`We received an error message when doing a global search, status code ${resp.status}, body ${await resp.text()}`,
			);
		}
	} catch (e: any) {
		logger(`getGlobalSearch: ${e?.message}`, 'error');
		throw e;
	}
}
