// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getOrganisationMetadata, findInROR} from './getROR';

// mock fetch
const mockFetchJson = jest.fn(props => Promise.resolve(props));
const mockFetch = jest.fn(props => {
	return Promise.resolve({
		status: 200,
		ok: true,
		json: () => mockFetchJson(props),
	});
});
global.fetch = mockFetch as any;

beforeEach(() => {
	jest.clearAllMocks();
});

it('getOrganisationMetadata does NOT call fetch on undefined ror_id', async () => {
	const ror_id = undefined;
	const resp = await getOrganisationMetadata(ror_id as any);
	expect(resp).toBe(null);
	expect(mockFetch).not.toBeCalled();
});

it('getOrganisationMetadata does NOT call fetch on ror_id=null', async () => {
	const ror_id = null;
	const resp = await getOrganisationMetadata(ror_id);
	expect(resp).toBe(null);
	expect(mockFetch).not.toBeCalled();
});

it('getOrganisationMetadata does NOT call fetch on empty string ror_id=" "', async () => {
	const ror_id = ' ';
	const resp = await getOrganisationMetadata(ror_id);
	expect(resp).toBe(null);
	expect(mockFetch).not.toBeCalled();
});

it('getOrganisationMetadata calls fetch on ror_id="ABCD"', async () => {
	const ror_id = 'ABCD';
	await getOrganisationMetadata(ror_id);

	// validate fetch call
	expect(mockFetch).toBeCalledTimes(1);
	expect(mockFetch).toBeCalledWith(
		`https://api.ror.org/organizations/${ror_id}`,
	);
});

it('findInROR calls fetch with search param and json header', async () => {
	const searchFor = 'ABCD';
	// mock ROR response
	mockFetchJson.mockResolvedValueOnce({
		items: [{id: 'test-id', name: 'Test organisation', links: []}],
	});

	const resp = await findInROR({searchFor});

	// validate response of 1 organisation
	expect(resp).toEqual([
		{
			data: {
				description: null,
				id: null,
				is_tenant: false,
				logo_id: null,
				name: 'Test organisation',
				parent: null,
				primary_maintainer: null,
				ror_id: 'test-id',
				slug: 'test-organisation',
				source: 'ROR',
				website: '',
			},
			key: 'test-id',
			label: 'Test organisation',
		},
	]);

	expect(mockFetch).toBeCalledTimes(1);
	expect(mockFetch).toBeCalledWith(
		`https://api.ror.org/organizations?query=${searchFor}`,
		{headers: {'Content-Type': 'application/json'}},
	);
});
