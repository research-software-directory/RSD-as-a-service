// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';

import {isOrcid} from '~/utils/getORCID';
import ContentLoader from '~/components/layout/ContentLoader';
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal';
import AddOrcidAlert from './AddOrcidAlert';
import OrcidUserItem from './OrcidUserItem';
import {ExpandedOrcidResult} from './apiOrcidUsers';

type OrcidUserListProps = {
	loading: boolean;
	persons: ExpandedOrcidResult[];
	searchFor: string;
	addOrcid: (value: string) => Promise<void>;
	removeOrcid: (value: string) => Promise<void>;
};

type DeleteAccountModal = {
	open: boolean;
	person?: ExpandedOrcidResult;
};

export default function OrcidUserList({
	loading,
	searchFor,
	persons,
	addOrcid,
	removeOrcid,
}: OrcidUserListProps) {
	const [modal, setModal] = useState<DeleteAccountModal>({
		open: false,
	});
	let invalid = true;

	if (loading)
		return (
			<section className="flex-1 flex min-h-[40rem]">
				<ContentLoader />
			</section>
		);

	if (searchFor) {
		// check if valid ORCID pattern
		invalid = !isOrcid(searchFor);
	}

	// No orcid users in DB - intial overview load
	if (persons.length === 0 && searchFor === '') {
		return (
			<section className="flex-1">
				<Alert
					severity="warning"
					sx={{
						marginTop: '0.5rem',
					}}
				>
					<AlertTitle sx={{fontWeight: 500}}>
						NO ORCID users found
					</AlertTitle>
					Add user by providing a valid ORCID in the search box.
					<br />
					The ORCID format is 0000-0000-0000-0000
				</Alert>
			</section>
		);
	}

	// Invalid search input provided
	if (searchFor != '' && invalid === true && persons.length === 0) {
		return (
			<section className="flex-1">
				<Alert
					severity="error"
					sx={{
						marginTop: '0.5rem',
					}}
				>
					<AlertTitle sx={{fontWeight: 500}}>
						Invalid ORCID format.
					</AlertTitle>
					The ORCID format is 0000-0000-0000-0000. <br />
				</Alert>
			</section>
		);
	}

	// Valid search input provided
	if (searchFor != '' && invalid === false && persons.length === 0) {
		return <AddOrcidAlert orcid={searchFor} addOrcid={addOrcid} />;
	}
	// ELSE we return orcids list
	return (
		<>
			<List>
				{persons.map(person => {
					return (
						<OrcidUserItem
							key={person['orcid-id']}
							orcid={person['orcid-id']}
							person={person}
							removeOrcid={() => {
								setModal({
									open: true,
									person,
								});
							}}
						/>
					);
				})}
			</List>
			<ConfirmDeleteModal
				open={modal.open}
				title="Remove account"
				body={
					<p>
						Are you sure you want to delete the account{' '}
						<strong>{modal?.person?.['orcid-id']}</strong>?
					</p>
				}
				onCancel={() => {
					setModal({
						open: false,
					});
				}}
				onDelete={() => {
					if (modal?.person?.['orcid-id']) {
						removeOrcid(modal?.person?.['orcid-id']);
						setModal({
							open: false,
						});
					}
				}}
			/>
		</>
	);
}
