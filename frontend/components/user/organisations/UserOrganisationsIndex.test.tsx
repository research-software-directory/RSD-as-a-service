// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {WithAppContext} from '~/utils/jest/WithAppContext';

import UserOrganisations from './index';

// MOCKS
import organisationByMaintainer from './__mocks__/organisationsByMaintainer.json';

const mockGetOrganisationsForMaintainer = jest.fn(props =>
	Promise.resolve([] as any),
);
const mockUseUserOrganisations = jest.fn();

jest.mock('./useUserOrganisations', () => ({
	__esModule: true,
	default: jest.fn(props => mockUseUserOrganisations(props)),
	getOrganisationsForMaintainer: jest.fn(props =>
		mockGetOrganisationsForMaintainer(props),
	),
}));

describe('components/user/organisations/index.tsx', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('render loader', () => {
		// return loading
		mockUseUserOrganisations.mockReturnValue({
			loading: true,
			organisations: [],
		});

		render(
			<WithAppContext>
				<UserOrganisations />
			</WithAppContext>,
		);

		screen.getByRole('progressbar');
	});

	it('render nothing to show message', () => {
		// return loading
		mockUseUserOrganisations.mockReturnValue({
			loading: false,
			organisations: [],
		});

		render(
			<WithAppContext>
				<UserOrganisations />
			</WithAppContext>,
		);

		screen.getByText('nothing to show');
	});

	it('render organisation cards', () => {
		// return loading
		mockUseUserOrganisations.mockReturnValue({
			loading: false,
			organisations: organisationByMaintainer,
		});

		render(
			<WithAppContext>
				<UserOrganisations />
			</WithAppContext>,
		);

		const organisations = screen.getAllByTestId('organisation-list-item');
		expect(organisations.length).toEqual(organisationByMaintainer.length);
	});
});
