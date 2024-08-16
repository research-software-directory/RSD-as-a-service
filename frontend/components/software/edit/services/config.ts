// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareServices} from './apiSoftwareServices';

type ServiceListProps = {
	name: string;
	desc: string;
	props: {
		scraped_at: keyof SoftwareServices;
		last_error: keyof SoftwareServices;
		url: keyof SoftwareServices;
	};
};

export const repoServiceList: ServiceListProps[] = [
	{
		name: 'Commit history',
		desc: 'Information is extracted from the repository api (github/gitlab)',
		props: {
			scraped_at: 'commit_history_scraped_at',
			last_error: 'commit_history_last_error',
			url: 'url',
		},
	},
	{
		name: 'Programming languages',
		desc: 'Information is extracted from the repository api (github/gitlab)',
		props: {
			scraped_at: 'languages_scraped_at',
			last_error: 'languages_last_error',
			url: 'url',
		},
	},
	{
		name: 'Repository statistics',
		desc: 'Information is extracted from the repository api (github/gitlab)',
		props: {
			scraped_at: 'basic_data_scraped_at',
			last_error: 'basic_data_last_error',
			url: 'url',
		},
	},
];

export const config = {
	repository: {
		title: 'Software repository',
		subtitle:
			'Additional information extracted using the source code repository URL',
	},
	package_managers: {
		title: 'Package managers',
		subtitle: 'Additional information extracted using package manager URL',
	},
};
