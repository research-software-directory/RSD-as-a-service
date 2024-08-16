// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import OrganisationSettingsAboutPage from './about-page';
import OrganisationMaintainers from './maintainers';
import OrganisationGeneralSettings from './general';
import {useRouter} from 'next/router';

export default function SettingsPageContent() {
	const router = useRouter();
	const settings = router.query['settings']?.toString() ?? '';

	switch (settings) {
		case 'about':
			return <OrganisationSettingsAboutPage />;
		case 'maintainers':
			return <OrganisationMaintainers />;
		default:
			return <OrganisationGeneralSettings />;
	}
}
