// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {useSession} from '~/auth';
import logger from '~/utils/logger';
import {OrganisationForOverview} from '~/types/Organisation';
import {extractCountFromHeader} from '~/utils/extractCountFromHeader';
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers';
import {paginationUrlParams} from '~/utils/postgrestUrl';
import usePaginationWithSearch from '~/utils/usePaginationWithSearch';

export type UserOrganisationProp = {
	searchFor?: string;
	page: number;
	rows: number;
	token?: string;
	account: string;
};

type State = {
	count: number;
	data: OrganisationForOverview[];
};

export async function getOrganisationsForMaintainer({
	searchFor,
	page,
	rows,
	token,
	account,
}: UserOrganisationProp) {
	try {
		// all top level organisations of maintainer
		const query = `maintainer_id=${account}&order=software_cnt.desc.nullslast,name`;
		// baseUrl
		let url = `${getBaseUrl()}/rpc/organisations_by_maintainer?${query}`;

		// search
		if (searchFor) {
			url += `&or=(name.ilike.*${encodeURIComponent(searchFor)}*,short_description.ilike.*${encodeURIComponent(searchFor)}*)`;
		}

		// pagination
		url += paginationUrlParams({rows, page});

		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				...createJsonHeaders(token),
				// request record count to be returned
				// note: it's returned in the header
				Prefer: 'count=exact',
			},
		});

		if ([200, 206].includes(resp.status)) {
			const data: OrganisationForOverview[] = await resp.json();
			const count = extractCountFromHeader(resp.headers) ?? 0;
			return {
				count,
				data,
			};
		}

		// otherwise request failed
		logger(
			`getOrganisationsForMaintainer: ${resp.status} ${resp.statusText}`,
			'warn',
		);

		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	} catch (e: any) {
		// otherwise request failed
		logger(`getOrganisationsForMaintainer: ${e.message}`, 'error');

		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	}
}

export default function useUserOrganisations() {
	const {user, token} = useSession();
	const {searchFor, page, rows, setCount} = usePaginationWithSearch(
		'Search organisation',
	);
	const [state, setState] = useState<State>({
		count: 0,
		data: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let abort = false;

		async function getOrganisations() {
			const organisations: State = await getOrganisationsForMaintainer({
				searchFor,
				page,
				rows,
				token,
				account: user?.account ?? '',
			});
			// abort
			if (abort) return;
			// set state
			setState(organisations);
			setCount(organisations.count);
			// set loading done
			setLoading(false);
		}

		if (token && user?.account) {
			getOrganisations();
		}

		return () => {
			abort = true;
		};
		// ignore setCount dependency to avoid cycle loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchFor, page, rows, token, user?.account]);

	return {
		organisations: state.data,
		loading,
	};
}
