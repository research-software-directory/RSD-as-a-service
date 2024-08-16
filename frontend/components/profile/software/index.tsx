// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import Pagination from '@mui/material/Pagination';

import {setDocumentCookie} from '~/utils/userSettings';
import {useUserSettings} from '~/components/organisation/context/UserSettingsContext';
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup';
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams';
import useQueryChange from '~/components/organisation/projects/useQueryChange';
import {useProfileContext} from '../context/ProfileContext';
import ProfileSoftwareOverview from './ProfileSoftwareOverview';
import ProfileSearchSoftware from './ProfileSearchSoftware';

export default function ProfileSoftware() {
	const {rsd_page_layout} = useUserSettings();
	const {software_cnt, software} = useProfileContext();
	const {page, rows} = useSoftwareParams();
	const {handleQueryChange} = useQueryChange();
	// if masonry we change to grid
	const initView = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout;
	const [view, setView] = useState<ProjectLayoutType>(initView ?? 'grid');
	const numPages = Math.ceil(software_cnt / rows);

	// console.group('ProfileSoftware')
	// console.log('page...', page)
	// console.log('rows...', rows)
	// console.log('software_cnt...', software_cnt)
	// console.log('software...', software)
	// console.log('view...', view)
	// console.log('rsd_page_layout...', rsd_page_layout)
	// console.groupEnd()

	function setLayout(view: ProjectLayoutType) {
		// update local view
		setView(view);
		// save to cookie
		setDocumentCookie(view, 'rsd_page_layout');
	}

	return (
		<div className="flex-1">
			<ProfileSearchSoftware
				count={software_cnt}
				layout={view}
				setView={setLayout}
			/>
			{/* software overview/content */}
			<ProfileSoftwareOverview layout={view} software={software} />
			{/* Pagination */}
			{numPages > 1 && (
				<div className="flex flex-wrap justify-center mt-8">
					<Pagination
						count={numPages}
						page={page}
						onChange={(_, page) => {
							handleQueryChange('page', page.toString());
						}}
					/>
				</div>
			)}
		</div>
	);
}
