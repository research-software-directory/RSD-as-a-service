// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {editMenuItemButtonSx} from '~/config/menuItems';
import {editSoftwarePage} from './editSoftwarePages';
import useRsdSettings from '~/config/useRsdSettings';

export default function EditSoftwareNav({
	slug,
	pageId,
}: {
	slug: string;
	pageId: string;
}) {
	const router = useRouter();
	const {host} = useRsdSettings();
	// default is true to follow useMenuItems approach
	const showCommunities =
		host.modules ? host.modules.includes('communities') : true;

	return (
		<nav>
			<List
				sx={{
					width: ['100%', '100%', '15rem'],
				}}
			>
				{editSoftwarePage.map(item => {
					if (
						item.id === 'communities' &&
						showCommunities === false
					) {
						// skip communities if not enabled in the settings
					} else {
						return (
							<ListItemButton
								data-testid="edit-software-nav-item"
								key={item.id}
								selected={item.id === pageId}
								onClick={() => {
									const location = `/software/${slug}/edit/${item.id}`;
									router.push(location);
								}}
								sx={editMenuItemButtonSx}
							>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText
									primary={item.label}
									secondary={item.status}
								/>
							</ListItemButton>
						);
					}
				})}
			</List>
		</nav>
	);
}
