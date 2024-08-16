// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import Link from 'next/link';

import {useSession} from '~/auth';
import useLoginProviders from '~/auth/api/useLoginProviders';
import useUserMenuItems from '~/config/useUserMenuItems';
import UserMenu from '~/components/layout/UserMenu';
import LoginDialog from './LoginDialog';

export default function LoginButton() {
	const providers = useLoginProviders();
	const {status} = useSession();
	const menuItems = useUserMenuItems();
	const [open, setOpen] = useState(false);

	// console.group('LoginButton')
	// console.log('status...', status)
	// console.log('menuItems...', menuItems)
	// console.groupEnd()

	if (status === 'loading') {
		return null;
	}

	if (status === 'authenticated') {
		// const menuItems = getUserMenuItems(session.user?.role)
		// we show user menu with the avatar and user specific options
		return <UserMenu menuOptions={menuItems} />;
	}

	// when there are multiple providers
	// we show modal with the list of login options
	if (providers && providers.length > 1) {
		return (
			<div className="whitespace-nowrap ml-2">
				<button tabIndex={0} onClick={() => setOpen(true)}>
					Sign in
				</button>
				<LoginDialog
					providers={providers}
					open={open}
					onClose={() => setOpen(false)}
				/>
			</div>
		);
	}

	// If there is only 1 provider we
	// link redirect directly to Sign in button
	return (
		<Link
			href={providers[0]?.redirectUrl ?? ''}
			className="whitespace-nowrap ml-2"
			tabIndex={0}
			passHref
		>
			Sign in
		</Link>
	);
}
