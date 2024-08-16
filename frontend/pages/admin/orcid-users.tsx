// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head';

import {app} from '~/config/app';
import {rowsPerPageOptions} from '~/config/pagination';
import {useUserSettings} from '~/config/UserSettingsContext';
import DefaultLayout from '~/components/layout/DefaultLayout';
import {adminPages} from '~/components/admin/AdminNav';
import AdminPageWithNav from '~/components/admin/AdminPageWithNav';
import {SearchProvider} from '~/components/search/SearchContext';
import {PaginationProvider} from '~/components/pagination/PaginationContext';
import OrcidUsersPage from '~/components/admin/orcid-users';

const pageTitle = `${adminPages['orcid'].title} | Admin page | ${app.title}`;

const pagination = {
	count: 0,
	page: 0,
	rows: 12,
	rowsOptions: [12, 24, 48],
	labelRowsPerPage: 'Per page',
};

export default function OrcidWitelistPage() {
	// use page rows from user settings
	const {rsd_page_rows} = useUserSettings();
	pagination.rows = rsd_page_rows ?? rowsPerPageOptions[0];

	return (
		<DefaultLayout>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<AdminPageWithNav title={adminPages['orcid'].title}>
				<SearchProvider>
					<PaginationProvider pagination={pagination}>
						<OrcidUsersPage />
					</PaginationProvider>
				</SearchProvider>
			</AdminPageWithNav>
		</DefaultLayout>
	);
}
