// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText';
import SortableListItem from '~/components/layout/SortableListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import {PackageManager, packageManagerSettings} from './apiPackageManager';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import {useSession} from '~/auth';
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers';
import useSnackbar from '~/components/snackbar/useSnackbar';
import logger from '~/utils/logger';

type PackageManagerItemProps = {
	pos: number;
	item: PackageManager;
	onDelete: (pos: number) => void;
	onEdit?: (pos: number) => void;
};

type ServiceStatusProps = {
	services: string[];
	download_count: number | null;
	download_count_scraped_at: string | null;
	reverse_dependency_count: number | null;
	reverse_dependency_count_scraped_at: string | null;
};

function RsdScraperStatus({
	services,
	download_count,
	download_count_scraped_at,
	reverse_dependency_count,
	reverse_dependency_count_scraped_at,
}: ServiceStatusProps) {
	const html = [];
	if (services?.length === 0) {
		return <span>RSD scraper services not available</span>;
	}
	if (services.includes('downloads')) {
		if (download_count_scraped_at && Number.isInteger(download_count)) {
			html.push(<span key="downloads">Downloads: {download_count}</span>);
		} else {
			html.push(<span key="downloads">Downloads: no info</span>);
		}
	}
	if (services.includes('dependents')) {
		if (
			reverse_dependency_count_scraped_at &&
			Number.isInteger(reverse_dependency_count)
		) {
			html.push(
				<span key="dependents">
					Dependents: {reverse_dependency_count}
				</span>,
			);
		} else {
			html.push(<span key="dependents">Dependents: no info</span>);
		}
	}
	return html;
}

export default function PackageManagerItem({
	pos,
	item,
	onDelete,
	onEdit,
}: PackageManagerItemProps) {
	const {showErrorMessage} = useSnackbar();
	const {user, token} = useSession();
	const isAdmin = user?.role === 'rsd_admin';
	// get package manager info
	const info = packageManagerSettings[item.package_manager ?? 'other'];
	const url = new URL(item.url);

	async function saveReason(
		reason: string,
		field:
			| 'download_count_scraping_disabled_reason'
			| 'reverse_dependency_count_scraping_disabled_reason',
	) {
		let sanitisedReason: string | null = reason.trim();

		if (sanitisedReason.length === 0) {
			sanitisedReason = null;
		}

		const patchUrl = `${getBaseUrl()}/package_manager?id=eq.${item.id}`;
		fetch(patchUrl, {
			method: 'PATCH',
			headers: {
				...createJsonHeaders(token),
			},
			body: JSON.stringify({[field]: sanitisedReason}),
		})
			.then(async resp => {
				if (!resp.ok) {
					showErrorMessage(
						'Failed to update the reason, please try again or contact us',
					);
					logger(
						`PackageManagerItem.tsx.saveReason: status ${resp.status}, body: ${await resp.text()}`,
						'error',
					);
				}
			})
			.catch(e => {
				showErrorMessage(
					'Failed to update the reason, please try again or contact us',
				);
				logger(
					`PackageManagerItem.tsx.saveReason: error when saving reason: ${e}`,
					'error',
				);
			});
	}

	return (
		<SortableListItem
			key={item.id}
			pos={pos}
			item={item}
			onEdit={onEdit}
			onDelete={onDelete}
			sx={{
				'&:hover': {
					backgroundColor: 'grey.100',
				},
			}}
		>
			<ListItemAvatar>
				<Avatar
					variant="square"
					src={info.icon ?? ''}
					sx={{
						width: '4rem',
						height: '4rem',
						'& img': {
							objectFit: 'contain',
						},
					}}
				>
					{url?.hostname?.slice(0, 3)}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={info.name}
				secondary={
					<>
						<span>{item.url}</span>
						<br />
						<RsdScraperStatus
							services={info?.services ?? []}
							download_count={item.download_count}
							download_count_scraped_at={
								item.download_count_scraped_at
							}
							reverse_dependency_count={
								item.reverse_dependency_count
							}
							reverse_dependency_count_scraped_at={
								item.reverse_dependency_count_scraped_at
							}
						/>
					</>
				}
				sx={{
					padding: '0rem 1rem',
				}}
			/>
			{isAdmin && (
				<List>
					<ListItem>
						<TextField
							label="Why scraping download count is disabled"
							defaultValue={
								item.download_count_scraping_disabled_reason
							}
							onBlur={e =>
								saveReason(
									e.target.value,
									'download_count_scraping_disabled_reason',
								)
							}
						/>
					</ListItem>
					<ListItem>
						<TextField
							label="Why scraping reverse dependency count is disabled"
							defaultValue={
								item.reverse_dependency_count_scraping_disabled_reason
							}
							onBlur={e =>
								saveReason(
									e.target.value,
									'reverse_dependency_count_scraping_disabled_reason',
								)
							}
						/>
					</ListItem>
				</List>
			)}
		</SortableListItem>
	);
}
