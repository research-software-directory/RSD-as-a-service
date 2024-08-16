// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext';

import UserProjects from './index';

import projectsByMaintainer from './__mocks__/projectsByMaintainer.json';
const mockUseUserProjects = jest.fn();
jest.mock('./useUserProjects', () => ({
	__esModule: true,
	default: jest.fn(props => mockUseUserProjects(props)),
}));
describe('components/user/organisations/index.tsx', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('render loader', () => {
		// return loading
		mockUseUserProjects.mockReturnValue({
			loading: true,
			projects: [],
		});

		render(
			<WithAppContext options={{session: mockSession}}>
				<UserProjects />
			</WithAppContext>,
		);

		screen.getByRole('progressbar');
	});

	it('render nothing to show message', () => {
		// return loading
		mockUseUserProjects.mockReturnValue({
			loading: false,
			projects: [],
		});

		render(
			<WithAppContext options={{session: mockSession}}>
				<UserProjects />
			</WithAppContext>,
		);

		screen.getByText('nothing to show');
	});

	it('render project list', () => {
		// return loading
		mockUseUserProjects.mockReturnValue({
			loading: false,
			projects: projectsByMaintainer,
		});

		render(
			<WithAppContext options={{session: mockSession}}>
				<UserProjects />
			</WithAppContext>,
		);

		const projects = screen.getAllByTestId('project-list-item');
		expect(projects.length).toEqual(projectsByMaintainer.length);
	});
});
