// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import copyToClipboard from '~/utils/copyToClipboard';
import useSnackbar from '~/components/snackbar/useSnackbar';
import EditSectionTitle from '~/components/layout/EditSectionTitle';
import {Invitation} from './apiMaintainers';

type InvitationListProps = {
	subject: string;
	body: string;
	invitations: Invitation[];
	onDelete: (invitation: Invitation) => Promise<void>;
};

function getExpiredText(daysValid: number): string {
	if (daysValid <= 0) {
		return 'this invitation is expired';
	} else if (daysValid === 1) {
		return 'expires in less than a day';
	} else {
		return `expires in ${daysValid} days`;
	}
}

export default function InvitationList({
	subject,
	body,
	invitations,
	onDelete,
}: InvitationListProps) {
	const {showErrorMessage, showInfoMessage} = useSnackbar();

	async function toClipboard(message?: string) {
		if (message) {
			const copied = await copyToClipboard(message);
			// notify user about copy action
			if (copied) {
				showInfoMessage('Copied to clipboard');
			} else {
				showErrorMessage(`Failed to copy link ${message}`);
			}
		}
	}

	if (invitations.length === 0) return null;

	return (
		<>
			<EditSectionTitle
				title={'Unused invitations'}
				subtitle={'These invitations are not used yet'}
			/>
			<List>
				{invitations.map(inv => {
					const currentLink = `${location.origin}/invite/${inv.type}/${inv.id}`;
					const expiresAt = new Date(inv.expires_at);
					const daysValid = Math.ceil(
						(expiresAt.valueOf() - new Date().valueOf()) /
							(1000 * 60 * 60 * 24),
					);
					const expiredText = getExpiredText(daysValid);
					return (
						<ListItem
							data-testid="unused-invitation-item"
							key={inv.id}
							disableGutters
							secondaryAction={
								<div className="flex gap-2">
									<IconButton
										title="Email invitation using my email app"
										href={`mailto:?subject=${subject}&body=${body}${encodeURIComponent('\n')}${currentLink}`}
										target="_blank"
										rel="noreferrer"
									>
										<EmailIcon />
									</IconButton>
									<IconButton
										title="Copy to clipboard"
										onClick={() => toClipboard(currentLink)}
									>
										<CopyIcon />
									</IconButton>
									<IconButton
										title="Delete unused invitation"
										onClick={() => onDelete(inv)}
									>
										<DeleteIcon />
									</IconButton>
								</div>
							}
							sx={{
								// make space for 3 buttons
								paddingRight: '9rem',
							}}
						>
							<ListItemText
								primary={`Created on ${new Date(inv.created_at).toLocaleString()} [${expiredText}]`}
								secondary={currentLink}
							/>
						</ListItem>
					);
				})}
			</List>
		</>
	);
}
