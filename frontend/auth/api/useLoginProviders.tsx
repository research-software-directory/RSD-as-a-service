// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import {Provider} from 'pages/api/fe/auth';

// save info after initial call
let loginProviders: Provider[] = [];

export default function useLoginProviders() {
	const [providers, setProviders] = useState<Provider[]>([]);

	// console.group('useLoginProviders')
	// console.log('providers...', providers)
	// console.log('loginProviders...', loginProviders)
	// console.groupEnd()

	useEffect(() => {
		let abort = false;

		async function getProviders() {
			if (loginProviders.length === 0) {
				const url = '/api/fe/auth';
				const resp = await fetch(url);
				if (resp.status === 200 && abort === false) {
					const providers: Provider[] = await resp.json();
					if (abort) return;
					setProviders(providers);
					// api response is the same once the app is started
					// because the info eventually comes from .env file
					// to avoid additional api calls we save api response
					// into the loginProviders variable and reuse it
					loginProviders = [...providers];
				}
			} else if (abort === false) {
				setProviders(loginProviders);
			}
		}
		if (abort === false) {
			getProviders();
		}

		return () => {
			abort = true;
		};
	}, []);

	return providers;
}
