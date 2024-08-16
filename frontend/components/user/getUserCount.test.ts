// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {mockResolvedValueOnce} from '~/utils/jest/mockFetch';

import {getUserCounts} from './getUserCounts';

it('getUserCounts', async () => {
	const mockProps = {
		token: 'TEST-TOKEN',
		frontend: true,
	};

	const expectUrl = '/api/v1/rpc/counts_by_maintainer';
	const expectPayload = {
		headers: {
			Authorization: 'Bearer TEST-TOKEN',
			'Content-Type': 'application/json',
		},
		method: 'GET',
	};

	mockResolvedValueOnce({
		software_cnt: undefined,
		project_cnt: undefined,
		organisation_cnt: undefined,
	});

	const resp = await getUserCounts(mockProps);

	expect(global.fetch).toBeCalledTimes(1);
	expect(global.fetch).toBeCalledWith(expectUrl, expectPayload);
});
