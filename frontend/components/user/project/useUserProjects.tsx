// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {useSession} from '~/auth';
import {extractCountFromHeader} from '~/utils/extractCountFromHeader';
import {createJsonHeaders} from '~/utils/fetchHelpers';
import logger from '~/utils/logger';
import {paginationUrlParams} from '~/utils/postgrestUrl';
import {ProjectOfOrganisation} from '~/types/Organisation';
import usePaginationWithSearch from '~/utils/usePaginationWithSearch';

export type UserProjectsProp = {
	searchFor?: string;
	page: number;
	rows: number;
	account: string;
	token?: string;
};

type State = {
	count: number;
	data: ProjectOfOrganisation[];
};

export async function getProjectsForMaintainer({
	searchFor,
	page,
	rows,
	token,
	account,
}: UserProjectsProp) {
	try {
		// baseUrl
		let url = `/api/v1/rpc/projects_by_maintainer?maintainer_id=${account}&order=is_published.desc,title`;

		// search
		if (searchFor) {
			url += `&or=(title.ilike.*${encodeURIComponent(searchFor)}*, subtitle.ilike.*${encodeURIComponent(searchFor)}*)`;
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
			const json: ProjectOfOrganisation[] = await resp.json();
			return {
				count: extractCountFromHeader(resp.headers) ?? 0,
				data: json,
			};
		}

		// otherwise request failed
		logger(
			`getProjectsForMaintainer: ${resp.status} ${resp.statusText}`,
			'warn',
		);

		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	} catch (e: any) {
		// otherwise request failed
		logger(`getProjectsForMaintainer: ${e.message}`, 'error');

		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	}
}

export default function useUserProjects() {
	const {user, token} = useSession();
	const {searchFor, page, rows, setCount} =
		usePaginationWithSearch('Search project');
	const [state, setState] = useState<State>({
		count: 0,
		data: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let abort = false;

		async function getProjects() {
			const projects: State = await getProjectsForMaintainer({
				searchFor,
				page,
				rows,
				token,
				account: user?.account ?? '',
			});

			if (abort) {
				return;
			}

			// set state
			setState(projects);
			// set count
			setCount(projects.count);
			// set loading done
			setLoading(false);
		}

		if (token && user?.account) {
			getProjects();
		}

		return () => {
			abort = true;
		};
		// ignore setCount dependency
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchFor, page, rows, token, user?.account]);

	return {
		projects: state.data,
		loading,
	};
}
