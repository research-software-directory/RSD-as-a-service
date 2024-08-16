// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router';
import {getSoftwareParams} from '~/utils/extractQueryParam';
import {useUserSettings} from '../../context/UserSettingsContext';

export default function useSoftwareParams() {
	// initialise router
	const router = useRouter();
	// get user preferences
	const {rsd_page_rows} = useUserSettings();
	// use encoded array params as json string to avoid
	// useEffect re-renders in api hooks
	const params = getSoftwareParams(router.query);

	if (typeof params.rows === 'undefined' && rsd_page_rows) {
		params.rows = rsd_page_rows;
	}

	function getFilterCount() {
		let count = 0;
		if (params?.keywords_json) count++;
		if (params?.prog_lang_json) count++;
		if (params?.licenses_json) count++;
		if (params?.search) count++;
		return count;
	}

	const filterCnt = getFilterCount();

	// console.group('useSoftwareParams')
	// console.log('params...', params)
	// console.log('rsd_page_rows...', rsd_page_rows)
	// console.groupEnd()

	// return params & count
	return {
		...params,
		filterCnt,
	};
}
