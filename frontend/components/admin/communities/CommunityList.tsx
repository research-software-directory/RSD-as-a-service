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
import {CommunityListProps} from '~/components/communities/apiCommunities';
import CommunityListItem from './CommunityListItem';
import NoCommunityAlert from './NoCommunityAlert';

type DeleteOrganisationModal = {
	open: boolean;
	item?: CommunityListProps;
};

type OrganisationsAdminListProps = {
	communities: CommunityListProps[];
	loading: boolean;
	page: number;
	onDeleteItem: (id: string, logo_id: string | null) => void;
};

export default function CommunityList({
	communities,
	loading,
	page,
	onDeleteItem,
}: OrganisationsAdminListProps) {
	const [modal, setModal] = useState<DeleteOrganisationModal>({
		open: false,
	});

	if (loading && !page) return <ContentLoader />;

	if (communities.length === 0) return <NoCommunityAlert />;

	return (
		<>
			<List
				sx={{
					width: '100%',
				}}
			>
				{communities.map(item => {
					return (
						<CommunityListItem
							key={item.id}
							item={item}
							onDelete={() =>
								setModal({
									open: true,
									item,
								})
							}
						/>
					);
				})}
			</List>
			<ConfirmDeleteModal
				open={modal.open}
				title="Remove community"
				body={
					<>
						<p>
							Are you sure you want to delete community{' '}
							<strong>{modal?.item?.name}</strong>?
						</p>
					</>
				}
				onCancel={() => {
					setModal({
						open: false,
					});
				}}
				onDelete={() => {
					// call remove method if id present
					if (modal.item && modal.item?.id)
						onDeleteItem(modal.item?.id, modal.item?.logo_id);
					setModal({
						open: false,
					});
				}}
			/>
		</>
	);
}
