// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form';

import ContentLoader from '~/components/layout/ContentLoader';
import UserAgreementsSection from './UserAgreementsSection';
import RemoveAccount from './RemoveAccount';
import {useLoginForAccount} from './useLoginForAccount';
import LoginForAccountList from './LoginForAccountList';
import LinkOrcidButton from './LinkOrcidButton';
import {UserSettingsType, useUserAgreements} from './useUserAgreements';
import BasicProfile from './BasicProfile';
import {useEffect} from 'react';

export default function UserSettings({
	orcidAuthLink,
}: {
	orcidAuthLink: string | null;
}) {
	const {loading, accounts, deleteLogin} = useLoginForAccount();
	const userAgreements = useUserAgreements();
	const publicProfile = {
		show: orcidAuthLink !== null,
		// disabled if ORCID account is not linked
		disabled: accounts.findIndex(item => item.provider === 'orcid') === -1,
		// orcid id linked
		orcid: accounts.find(item => item.provider === 'orcid')?.sub,
	};

	const methods = useForm<UserSettingsType>({
		mode: 'onChange',
	});

	// console.group('UserSettings')
	// console.log('publicProfile...', publicProfile)
	// console.log('loading...', loading)
	// console.log('userAgreements...', userAgreements)
	// console.log('accounts...', accounts)
	// console.groupEnd()

	/**
	 * We need to reset form value for public_orcid_profile in order to pass
	 * the inital value to other components that listen for change in this value
	 */
	useEffect(() => {
		if (typeof userAgreements?.public_orcid_profile !== 'undefined') {
			methods.reset({
				public_orcid_profile: userAgreements.public_orcid_profile,
			});
		}
	}, [methods, userAgreements.public_orcid_profile]);

	if (loading || userAgreements.loading) {
		return <ContentLoader />;
	}

	return (
		<div data-testid="user-settings-section" className="pt-2">
			{/* Render only if all info present in order to properly load defaultValues */}
			<FormProvider {...methods}>
				<form id="profile-settings-form" className="flex-1">
					<BasicProfile orcid={publicProfile.orcid} />

					{/* use FormProvider to check for user agreement values */}
					<LoginForAccountList
						accounts={accounts}
						deleteLogin={deleteLogin}
					/>

					{publicProfile.show ?
						<LinkOrcidButton
							orcidAuthLink={orcidAuthLink}
							disabled={!publicProfile.disabled}
						/>
					:	null}

					<UserAgreementsSection
						publicProfile={publicProfile}
						{...userAgreements}
					/>

					{/* use FormProvider to check for user agreement values */}
					<RemoveAccount />
				</form>
			</FormProvider>
		</div>
	);
}
