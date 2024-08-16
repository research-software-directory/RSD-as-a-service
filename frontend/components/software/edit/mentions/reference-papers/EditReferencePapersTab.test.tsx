// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext';
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext';

import ReferencePapersTab from './index';
import {cfgReferencePapers} from './config';

// MOCKS
import referencePapersForSoftware from './__mocks__/referencePapersForSoftware.json';
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext';
import mockCrossrefItems from '~/utils/__mocks__/crossrefItems.json';

// Mock getMentionsForSoftware
const mockGetMentionsForSoftware = jest.fn(props => Promise.resolve([] as any));
const mockGetMentionByDoiFromRsd = jest.fn(props => Promise.resolve([] as any));

jest.mock('~/utils/editMentions', () => ({
	...jest.requireActual('~/utils/editMentions'),
	getMentionsForSoftware: jest.fn(props => mockGetMentionsForSoftware(props)),
	getMentionByDoiFromRsd: jest.fn(props => mockGetMentionByDoiFromRsd(props)),
}));

const mockGetMentionByDoi = jest.fn(props => Promise.resolve([] as any));
jest.mock('~/utils/getDOI', () => ({
	getMentionByDoi: jest.fn(props => mockGetMentionByDoi(props)),
}));

// Mock findPublicationByTitle
const mockFindPublicationByTitle = jest.fn(props => Promise.resolve([] as any));
jest.mock(
	'~/components/software/edit/mentions/output/apiRelatedOutput',
	() => ({
		findPublicationByTitle: jest.fn(props =>
			mockFindPublicationByTitle(props),
		),
	}),
);

const mockAddToMentionForSoftware = jest.fn(props =>
	Promise.resolve([] as any),
);
const mockRemoveMentionForSoftware = jest.fn(props =>
	Promise.resolve([] as any),
);
jest.mock('./apiReferencePapers', () => ({
	addToMentionForSoftware: jest.fn(props =>
		mockAddToMentionForSoftware(props),
	),
	removeReferencePaperForSoftware: jest.fn(props =>
		mockRemoveMentionForSoftware(props),
	),
}));

// MOCK software mention context
const mockSoftwareMentionContext = {
	loading: true,
	reference_papers: [],
	citations: [],
	output: [],
	counts: {
		reference_papers: 0,
		citations: 0,
		output: 0,
	},
	tab: 'reference_papers',
	setTab: jest.fn(),
	setOutputCnt: jest.fn(),
	setCitationCnt: jest.fn(),
	setReferencePapersCnt: jest.fn(),
};
const mockUseSoftwareMentionContext = jest.fn(
	props => mockSoftwareMentionContext,
);
jest.mock('~/components/software/edit/mentions/SoftwareMentionContext', () => ({
	useSoftwareMentionContext: jest.fn(props =>
		mockUseSoftwareMentionContext(props),
	),
}));

describe('frontend/components/software/edit/mentions/outputindex.tsx', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loader when loading=true', () => {
		mockSoftwareMentionContext.loading = true;
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);

		// render
		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);

		screen.getByRole('progressbar');
	});

	it('renders no reference papers message', async () => {
		// required software id
		softwareState.software.id = 'test-software-id';
		// mock no items
		mockSoftwareMentionContext.loading = false;
		mockSoftwareMentionContext.reference_papers = [];
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);
		// render
		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);

		screen.getByText('No reference papers to show');
	});

	it('renders mocked reference papers', async () => {
		// required software id
		softwareState.software.id = 'test-software-id';
		// mock items
		mockSoftwareMentionContext.loading = false;
		mockSoftwareMentionContext.reference_papers =
			referencePapersForSoftware as any;
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);
		// render
		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);
		// wait for loader
		// await waitForElementToBeRemoved(screen.getByRole('progressbar'))

		const mentions = screen.getAllByTestId('mention-item-base');
		expect(mentions.length).toEqual(referencePapersForSoftware.length);
	});

	it('search reference paper by DOI', async () => {
		const validDOI = '10.5281/zenodo.3401363';
		// required software id
		softwareState.software.id = 'test-software-id';
		mockSoftwareMentionContext.loading = false;
		mockSoftwareMentionContext.reference_papers = [];
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);
		// resolve DOI not found in RSD
		mockGetMentionByDoiFromRsd.mockResolvedValueOnce({
			status: 200,
			message: [],
		});
		// resolve DOI found via doi.org
		mockGetMentionByDoi.mockResolvedValueOnce({
			status: 200,
			message: mockCrossrefItems[0],
		});
		// render
		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);

		// find by DOI
		const find = screen.getByRole('combobox', {
			name: cfgReferencePapers.findMention.label,
		});
		// populate DOI value
		fireEvent.change(find, {target: {value: validDOI}});

		await waitFor(() => {
			// call RSD api to find mention by DOI
			expect(mockGetMentionByDoiFromRsd).toBeCalledTimes(1);
			expect(mockGetMentionByDoiFromRsd).toBeCalledWith({
				doi: validDOI,
				token: mockSession.token,
			});
			// becase we did not found it in RSD we try doi.org
			expect(mockGetMentionByDoi).toBeCalledTimes(1);
			expect(mockGetMentionByDoi).toBeCalledWith(validDOI);
		});
	});

	it('search reference paper by text', async () => {
		const searchFor = 'My lovely mention';
		// required software id
		softwareState.software.id = 'test-software-id';
		mockSoftwareMentionContext.loading = false;
		mockSoftwareMentionContext.reference_papers = [];
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);

		// render
		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);

		// find mention
		const find = screen.getByRole('combobox', {
			name: cfgReferencePapers.findMention.label,
		});
		// populate search value
		fireEvent.change(find, {target: {value: searchFor}});

		await waitFor(() => {
			// call RSD api to find mention by DOI
			expect(mockFindPublicationByTitle).toBeCalledTimes(1);
			expect(mockFindPublicationByTitle).toBeCalledWith({
				id: softwareState.software.id,
				searchFor,
				token: mockSession.token,
			});
		});
	});

	it('delete reference paper', async () => {
		// required software id
		softwareState.software.id = 'test-software-id';
		mockSoftwareMentionContext.loading = false;
		mockSoftwareMentionContext.reference_papers =
			referencePapersForSoftware as any;
		mockUseSoftwareMentionContext.mockReturnValueOnce(
			mockSoftwareMentionContext,
		);

		render(
			<WithAppContext options={{session: mockSession}}>
				<WithSoftwareContext state={softwareState}>
					<ReferencePapersTab />
				</WithSoftwareContext>
			</WithAppContext>,
		);

		// find and use delete button
		const deleteBtns = screen.getAllByTestId('DeleteIcon');
		expect(deleteBtns.length).toEqual(referencePapersForSoftware.length);
		fireEvent.click(deleteBtns[0]);

		// find and use cofirm button
		const confirm = await screen.findByRole('button', {
			name: 'Remove',
		});
		fireEvent.click(confirm);

		await waitFor(() => {
			expect(mockRemoveMentionForSoftware).toBeCalledTimes(1);
			expect(mockRemoveMentionForSoftware).toBeCalledWith({
				mention: referencePapersForSoftware[0].id,
				software: softwareState.software.id,
				token: mockSession.token,
			});
		});
	});
});
