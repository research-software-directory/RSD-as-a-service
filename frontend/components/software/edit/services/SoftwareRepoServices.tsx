// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List';
import {useSoftwareServices} from './apiSoftwareServices';
import ContentLoader from '~/components/layout/ContentLoader';

import {repoServiceList} from './config';
import {ServiceInfoListItem} from './ServiceInfoListItem';

export default function SoftwareRepoServices() {
	const {loading, services} = useSoftwareServices();

	if (loading) return <ContentLoader />;

	return (
		<>
			{services?.scraping_disabled_reason ?
				<span style={{color: 'red'}}>
					The harvesters for this repo were disabled by the admins for
					the following reason: {services?.scraping_disabled_reason}
				</span>
			:	null}
			<List>
				{repoServiceList.map(service => {
					const props = {
						title: service.name,
						desc: service.desc,
						scraped_at:
							services ?
								services[service.props.scraped_at]
							:	null,
						last_error:
							services ?
								services[service.props.last_error]
							:	null,
						url: services ? services[service.props.url] : null,
						platform: services ? services['code_platform'] : null,
					};
					return (
						<ServiceInfoListItem
							key={service.name}
							scraping_disabled_reason={null}
							{...props}
						/>
					);
				})}
			</List>
		</>
	);
}
