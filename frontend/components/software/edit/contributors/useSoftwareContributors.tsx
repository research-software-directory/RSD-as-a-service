// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';
import {useSession} from '~/auth';
import {Contributor} from '~/types/Contributor';
import {getContributorsForSoftware} from '~/utils/editContributors';
import useSoftwareContext from '../useSoftwareContext';

export default function useSoftwareContributors() {
	const {token} = useSession();
	const {software} = useSoftwareContext();
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadedSoftware, setLoadedSoftware] = useState<string>('');

	// console.log('contributors...',contributors)

	useEffect(() => {
		let abort = false;
		const getContributors = async (software: string, token: string) => {
			setLoading(true);
			const data = (await getContributorsForSoftware({
				software,
				token,
			})) as Contributor[];
			if (abort) return;
			// update state
			setContributors(data ?? []);
			setLoadedSoftware(software);
			setLoading(false);
		};
		if (software?.id && token && software.id !== loadedSoftware) {
			getContributors(software.id, token);
		}
		return () => {
			abort = true;
		};
	}, [software?.id, loadedSoftware, token]);

	return {
		loading,
		contributors,
		setContributors,
		setLoading,
	};
}
