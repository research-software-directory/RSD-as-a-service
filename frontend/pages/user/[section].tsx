// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head';
import {GetServerSidePropsContext} from 'next/types';

import {useSession} from '~/auth';
import ProtectedContent from '~/auth/ProtectedContent';
import {getRedirectUrl} from '~/auth/api/authHelpers';
import {app} from '~/config/app';
import {getUserSettings} from '~/utils/userSettings';
import DefaultLayout from '~/components/layout/DefaultLayout';
import {userMenu, UserPageId} from '~/components/user/UserNavItems';
import {PaginationProvider} from '~/components/pagination/PaginationContext';
import {SearchProvider} from '~/components/search/SearchContext';
import UserTitle from '~/components/user/UserTitle';
import UserNav, {UserCounts} from '~/components/user/UserNav';
import {getUserCounts} from '~/components/user/getUserCounts';
import {orcidCoupleProps} from '~/components/user/settings/apiLinkOrcidProps';
import UserSection from '~/components/user/UserSection';

type UserPagesProps = Readonly<{
	section: UserPageId;
	counts: UserCounts;
	orcidAuthLink: string | null;
	rsd_page_rows: number;
	showSearch: boolean;
}>;

export default function UserPages({
	section,
	counts,
	orcidAuthLink,
	rsd_page_rows,
	showSearch,
}: UserPagesProps) {
	const {user} = useSession();
	const pageTitle = `${user?.name ?? 'User'} | ${app.title}`;

	// console.group('UserPages')
	// console.log('pageSection...', pageSection)
	// console.log('pageTitle...', pageTitle)
	// console.log('orcidAuthLink...', orcidAuthLink)
	// console.log('counts...', counts)
	// console.log('rsd_page_rows...', rsd_page_rows)
	// console.groupEnd()

	return (
		<DefaultLayout>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<ProtectedContent>
				<SearchProvider>
					<PaginationProvider pagination={{rows: rsd_page_rows}}>
						<UserTitle
							title={user?.name ?? 'User'}
							showSearch={showSearch ?? false}
						/>
						<section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem] pb-12">
							<div>
								<UserNav selected={section} counts={counts} />
							</div>
							<UserSection
								section={section}
								orcidAuthLink={orcidAuthLink}
							/>
						</section>
					</PaginationProvider>
				</SearchProvider>
			</ProtectedContent>
		</DefaultLayout>
	);
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const {params, req} = context;
		const section = params?.section;
		const token = req?.cookies['rsd_token'];
		// placeholder for orcid couple link
		let orcidAuthLink: string | null = null;
		// extract user settings from cookie
		const {rsd_page_rows} = getUserSettings(req);
		// console.log('getServerSideProps...params...', params)
		// console.log('getServerSideProps...token...', token)
		// console.log('getServerSideProps...user...', user)

		if (typeof section == 'undefined') {
			// 404 if no section parameter
			return {
				notFound: true,
			};
		}
		// try to load menu item
		const sectionItem = userMenu.find(item => item.id === section);
		if (typeof sectionItem == 'undefined') {
			// 404 is section key does not exists
			return {
				notFound: true,
			};
		}

		// load counts for user
		const counts = await getUserCounts({
			token,
		});

		if (section === 'settings') {
			// only relevant for settings page
			const orcid = await orcidCoupleProps();
			if (orcid && orcid?.redirect_couple_uri) {
				// getRedirectUrl uses redirect_uri to construct redirectURL
				orcid.redirect_uri = orcid.redirect_couple_uri;
				orcidAuthLink = getRedirectUrl(orcid);
			}
		}

		return {
			// passed to page component as props
			props: {
				section,
				counts,
				orcidAuthLink,
				rsd_page_rows,
				showSearch: sectionItem?.showSearch ?? false,
			},
		};
	} catch (e) {
		return {
			notFound: true,
		};
	}
}
