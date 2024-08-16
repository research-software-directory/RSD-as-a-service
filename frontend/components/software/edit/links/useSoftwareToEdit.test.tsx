// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';

import {
	CategoriesForSoftware,
	CategoryForSoftwareIds,
} from '~/types/SoftwareTypes';
import useSoftwareToEdit from './useSoftwareToEdit';

// MOCS
// Mock getSoftwareToEdit
import useSoftwareToEditData from './__mocks__/useSoftwareToEditData.json';
const mockGetSoftwareToEdit = jest.fn(props => Promise.resolve([] as any));
jest.mock('~/utils/editSoftware', () => ({
	getSoftwareToEdit: jest.fn(props => mockGetSoftwareToEdit(props)),
}));

// MOCK getKeywordsForSoftware, getLicenseForSoftware
const mockGetKeywordsForSoftware = jest.fn(props => Promise.resolve([] as any));
const mockGetCategoriesForSoftware = jest.fn(props =>
	Promise.resolve([] as CategoriesForSoftware),
);
const mockGetCategoriesForSoftwareIds = jest.fn(props =>
	Promise.resolve(new Set() as CategoryForSoftwareIds),
);
const mockGetLicenseForSoftware = jest.fn(props => Promise.resolve([] as any));
jest.mock('~/utils/getSoftware', () => ({
	getKeywordsForSoftware: jest.fn(props => mockGetKeywordsForSoftware(props)),
	getCategoriesForSoftware: jest.fn(props =>
		mockGetCategoriesForSoftware(props),
	),
	getCategoryForSoftwareIds: jest.fn(
		props => mockGetCategoriesForSoftwareIds,
	),
	getLicenseForSoftware: jest.fn(props => mockGetLicenseForSoftware(props)),
}));

const copySoftware = {
	...useSoftwareToEditData,
};

const mockKeywords = [...copySoftware.keywords];

const mockCategories = [...copySoftware.categories];

const mockLicenses = [...copySoftware.licenses];

// wrap hook into component
function WithUseSoftwareToEditHook(props: any) {
	const {loading, editSoftware} = useSoftwareToEdit(props);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <div>{JSON.stringify(editSoftware, null, 2)}</div>;
}

beforeEach(() => {
	jest.clearAllMocks();
});

it('renders loading', () => {
	const mockProps = {
		slug: 'test-slug',
		token: 'TEST-TOKEN',
	};

	render(<WithUseSoftwareToEditHook {...mockProps} />);
	const loader = screen.getByText('Loading...');
});

it('renders software returned by api', async () => {
	const mockProps = {
		slug: 'test-slug',
		token: 'TEST-TOKEN',
	};

	// delete copySoftware.keywords
	// delete copySoftware.licenses

	// mock api responses
	mockGetSoftwareToEdit.mockResolvedValueOnce(copySoftware);
	mockGetKeywordsForSoftware.mockResolvedValueOnce(mockKeywords);
	mockGetCategoriesForSoftware.mockResolvedValueOnce(mockCategories as any);
	mockGetLicenseForSoftware.mockResolvedValueOnce(mockLicenses);

	render(<WithUseSoftwareToEditHook {...mockProps} />);

	// validate software id returned
	const softwareId = await screen.findByText(RegExp(copySoftware.id));
});
