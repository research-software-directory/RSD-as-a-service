// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import List from '@mui/material/List';

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal';
import ContentLoader from '~/components/layout/ContentLoader';
import {OrganisationList} from '~/types/Organisation';
import {RemoveOrganisationProps} from './apiOrganisation';
import OrganisationItem from './OrganisationItem';
import Alert from '@mui/material/Alert';

type DeleteOrganisationModal = {
	open: boolean;
	organisation?: OrganisationList;
};

type OrganisationsAdminListProps = {
	organisations: OrganisationList[];
	loading: boolean;
	page: number;
	onDeleteOrganisation: (props: RemoveOrganisationProps) => void;
};

export default function OrganisationsAdminList({
	organisations,
	loading,
	page,
	onDeleteOrganisation,
}: OrganisationsAdminListProps) {
	const [modal, setModal] = useState<DeleteOrganisationModal>({
		open: false,
	});

	if (loading && !page) return <ContentLoader />;

	if (organisations.length === 0) {
		return (
			<Alert severity="info" sx={{margin: '1.5rem 0rem'}}>
				No organisation to show.
			</Alert>
		);
	}

	function onDelete(organisation: OrganisationList) {
		if (organisation) {
			setModal({
				open: true,
				organisation,
			});
		}
	}

	return (
		<>
			<List
				sx={{
					width: '100%',
				}}
			>
				{organisations.map(item => {
					return (
						<OrganisationItem
							key={item.id}
							item={item}
							onDelete={() => onDelete(item)}
						/>
					);
				})}
			</List>
			<ConfirmDeleteModal
				open={modal.open}
				title="Remove organisation"
				body={
					<>
						<p>
							Are you sure you want to delete organisation{' '}
							<strong>{modal?.organisation?.name}</strong>?
						</p>
					</>
				}
				onCancel={() => {
					setModal({
						open: false,
					});
				}}
				onDelete={() => {
					onDeleteOrganisation({
						uuid: modal?.organisation?.id ?? '',
						logo_id: modal?.organisation?.logo_id ?? null,
					});
					setModal({
						open: false,
					});
				}}
			/>
		</>
	);
}
