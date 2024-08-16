// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
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
import usePaginationWithSearch from '~/utils/usePaginationWithSearch';

type SoftwareByMaintainer = {
	id: string;
	slug: string;
	brand_name: string;
	short_statement: string;
	is_published: boolean;
	image_id: string | null;
	updated_at: string;
	contributor_cnt: number;
	mention_cnt: number;
};

type UserSoftwareProp = {
	searchFor?: string;
	page: number;
	rows: number;
	token?: string;
	account: string;
};

type State = {
	count: number;
	data: SoftwareByMaintainer[];
};

export async function getSoftwareForMaintainer({
	searchFor,
	page,
	rows,
	account,
	token,
}: UserSoftwareProp) {
	try {
		// baseUrl
		let url = `/api/v1/rpc/software_by_maintainer?maintainer_id=${account}&order=brand_name`;
		// search
		if (searchFor) {
			url += `&or=(brand_name.ilike.*${encodeURIComponent(searchFor)}*, short_statement.ilike.*${encodeURIComponent(searchFor)}*)`;
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
			const json: SoftwareByMaintainer[] = await resp.json();
			return {
				count: extractCountFromHeader(resp.headers) ?? 0,
				data: json,
			};
		}
		// otherwise request failed
		logger(
			`getSoftwareForMaintainer: ${resp.status} ${resp.statusText}`,
			'warn',
		);
		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	} catch (e: any) {
		// otherwise request failed
		logger(`getSoftwareForMaintainer: ${e.message}`, 'error');
		// we log and return zero
		return {
			count: 0,
			data: [],
		};
	}
}

export default function useUserSoftware() {
	const {user, token} = useSession();
	const {searchFor, page, rows, setCount} =
		usePaginationWithSearch('Search software');
	const [state, setState] = useState<State>({
		count: 0,
		data: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let abort = false;

		async function getSoftware() {
			// set loading done
			// setLoading(true)
			const software: State = await getSoftwareForMaintainer({
				searchFor,
				page,
				rows,
				token,
				account: user?.account ?? '',
			});
			// abort
			if (abort) return;
			// set state
			setState(software);
			setCount(software.count);
			// set loading done
			setLoading(false);
		}

		if (token && user?.account) {
			getSoftware();
		}

		return () => {
			abort = true;
		};
		// ignore setCount dependency warning
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchFor, page, rows, token, user?.account]);

	return {
		software: state.data,
		loading,
	};
}
