// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';
import {
	ReleaseCountByYear,
	getReleasesCountForOrganisation,
} from './apiOrganisationReleases';

type UseSoftwareReleaseProps = {
	organisation_id?: string;
	token: string;
};

export default function useReleaseCount({
	organisation_id,
	token,
}: UseSoftwareReleaseProps) {
	const [loading, setLoading] = useState(true);
	const [countsByYear, setCountsByYear] = useState<ReleaseCountByYear[]>();

	// console.group('useReleaseCount')
	// console.log('loading...', loading)
	// console.log('countsByYear...', countsByYear)
	// console.groupEnd()

	useEffect(() => {
		async function getReleases() {
			setLoading(true);
			// make request
			const countByYear = await getReleasesCountForOrganisation({
				organisation_id,
				token,
			});
			// update counts by year
			if (countByYear) setCountsByYear(countByYear);
			// set loading is done
			setLoading(false);
		}

		if (organisation_id) {
			getReleases();
		}
	}, [organisation_id, token]);

	return {
		loading,
		countsByYear,
	};
}
