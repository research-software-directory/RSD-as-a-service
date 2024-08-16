// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';

import {useSession} from '~/auth';
import useSnackbar from '~/components/snackbar/useSnackbar';
import {
	OrcidBulkImportReport,
	RsdOrcid,
	importOrcidList,
} from './apiImportOrcidList';
import OrcidInputBody from './OrcidInputBody';
import OrcidImportReport from './OrcidImportReport';

type BulkImportOrcidProps = {
	loadOrcidList: () => Promise<void>;
};

export default function BulkImportOrcid({loadOrcidList}: BulkImportOrcidProps) {
	const smallScreen = useMediaQuery('(max-width:768px)');
	const {token} = useSession();
	const {showErrorMessage, showSuccessMessage} = useSnackbar();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [validationReport, setValidationReport] =
		useState<OrcidBulkImportReport>(null);

	function closeDialog() {
		// clear validation report
		setValidationReport(null);
		// close dialog
		setDialogOpen(false);
	}

	function onCloseDialog(e: object, reason: string) {
		// we do not allow backdrop click
		if (reason !== 'backdropClick') closeDialog();
	}

	async function importSelection(selection: RsdOrcid[]) {
		// nothing to add
		if (selection.length === 0) {
			// we just close dialog
			closeDialog();
			return false;
		}
		// add orcid list
		const resp = await importOrcidList({
			orcidList: selection,
			token,
		});

		if (resp.status !== 200) {
			showErrorMessage(`Failed to import. ${resp.message}`);
		} else {
			loadOrcidList();
			closeDialog();
			showSuccessMessage(`Succesfully added ${selection.length} items`);
		}
	}

	return (
		<>
			<IconButton
				title="Import ORCID list"
				sx={{
					alignSelf: 'center',
					marginRight: '1rem',
				}}
				onClick={() => setDialogOpen(true)}
			>
				<PostAddIcon />
			</IconButton>
			{dialogOpen ?
				<Dialog
					fullScreen={smallScreen}
					open={dialogOpen}
					onClose={onCloseDialog}
					sx={{
						'.MuiPaper-root': {
							position: 'relative',
							minWidth: smallScreen ? 'auto' : '40rem',
							height: smallScreen ? 'inherit' : '60vh',
						},
					}}
				>
					{validationReport !== null ?
						<OrcidImportReport
							validationReport={validationReport}
							onCancel={closeDialog}
							onImport={importSelection}
						/>
					:	<OrcidInputBody
							onCancel={closeDialog}
							onSubmit={setValidationReport}
						/>
					}
				</Dialog>
			:	null}
		</>
	);
}
