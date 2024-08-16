// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext, useState} from 'react';

import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup';
import {rowsPerPageOptions} from './pagination';
import {setDocumentCookie} from '~/utils/userSettings';

export type UserSettingsProps = {
	rsd_page_layout: LayoutType;
	rsd_page_rows: number;
};

export type UserSettingsContextProps = {
	user: UserSettingsProps;
	setUser: (user: UserSettingsProps) => void;
};

const defaultUserProps: UserSettingsProps = {
	rsd_page_layout: 'masonry',
	rsd_page_rows: rowsPerPageOptions[0],
};

export const UserSettingsContext = createContext<UserSettingsContextProps>({
	user: defaultUserProps,
	setUser: () => {},
});

export function UserSettingsProvider(props: any) {
	const initUser = {
		...defaultUserProps,
		...props?.user,
	};
	const [user, setUser] = useState(initUser);

	// console.group('UserSettingsProvider')
	// console.log('props?.user...', props?.user)
	// console.log('initUser...', initUser)
	// console.log('user...', user)
	// console.groupEnd()

	return <UserSettingsContext.Provider value={{user, setUser}} {...props} />;
}

export function useUserSettings() {
	const {user, setUser} = useContext(UserSettingsContext);

	function setPageLayout(layout: LayoutType) {
		// save to cookie
		setDocumentCookie(layout, 'rsd_page_layout');
		// save to state
		setUser({
			...user,
			rsd_page_layout: layout,
		});
	}

	function setPageRows(rows: number) {
		// save to cookie
		setDocumentCookie(rows.toString(), 'rsd_page_rows');
		// save to state
		setUser({
			...user,
			rsd_page_rows: rows,
		});
	}

	return {
		...user,
		setPageLayout,
		setPageRows,
	};
}
