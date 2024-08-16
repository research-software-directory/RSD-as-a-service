// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

import List from '@mui/material/List';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import PostAddIcon from '@mui/icons-material/PostAdd';

import ImportDialogTitle from '~/components/mention/ImportMentions/ImportDialogTitle';
import ImportDialogActions from '~/components/mention/ImportMentions/ImportDialogActions';
import {OrcidInfo} from '../OrcidUserItem';
import {
	OrcidBulkImportReport,
	OrcidSearchResult,
	RsdOrcid,
} from './apiImportOrcidList';

type OrcidImportReportProps = {
	readonly validationReport: OrcidBulkImportReport;
	onCancel: () => void;
	onImport: (selection: RsdOrcid[]) => void;
};

export default function OrcidImportReport({
	validationReport,
	onCancel,
	onImport,
}: OrcidImportReportProps) {
	const [selectedCnt, setSelectedCnt] = useState(0);
	const [orcidList] = useState<OrcidBulkImportReport>(validationReport);

	// console.group('OrcidImportReport')
	// console.log('initialResults...', initialResults)
	// console.log('validCnt...', validCnt)
	// console.groupEnd()

	useEffect(() => {
		let selectedCnt = 0;
		const results: string[] = [];
		if (validationReport) {
			// convert Map to array of results
			validationReport.forEach(result => {
				if (result?.status === 'valid' && result?.include === true)
					selectedCnt++;
			});
		}
		// debugger
		setSelectedCnt(selectedCnt);
	}, [validationReport]);

	function toggleSelection(key: string) {
		const item = orcidList?.get(key);
		if (item) {
			// toggle selection
			item.include = !item.include;
			// update count
			let selectCnt = 0;
			orcidList?.forEach(item => {
				if (item.include === true) selectCnt++;
			});
			// update selected count
			// NOTE! the valid count will cause component
			// to rerender and also include orcidList value change
			setSelectedCnt(selectCnt);
		}
	}

	function generateErrorMessage(result: OrcidSearchResult) {
		switch (result.status) {
			case 'invalid':
				return 'Not a valid OCRID';
			case 'orcidNotFound':
				return 'ORCID not found';
			case 'alreadyImported':
				return 'This ORCID is already imported';
			default:
				return 'Unknown error';
		}
	}

	function startImport() {
		const selected: RsdOrcid[] = [];
		orcidList?.forEach(item => {
			if (item.include === true) {
				selected.push({orcid: item.orcid});
			}
		});
		// call import for the selection
		onImport(selected);
	}

	function renderListItems() {
		const html: any[] = [];
		// nothing to report
		if (orcidList === null) return html;
		// render report
		orcidList.forEach((item, key) => {
			// console.log('item...', item)
			// console.log('key...', key)
			html.push(
				<ListItem
					data-testid="import-mention-report-item"
					key={item.orcid}
					secondaryAction={
						<Switch
							data-testid="switch-toggle-button"
							disabled={
								item?.status !== 'valid' &&
								item?.status !== 'orcidNotFound'
							}
							checked={item.include}
							onChange={() => toggleSelection(key)}
						/>
					}
					sx={{
						paddingRight: '5rem',
						'&:hover': {
							backgroundColor: 'grey.100',
						},
					}}
				>
					<ListItemText
						primary={
							item?.status === 'valid' ?
								<a
									href={`https://orcid.org//${item.orcid}`}
									target="_blank"
								>
									{item.orcid}
								</a>
							:	<span>{item.orcid}</span>
						}
						secondary={
							item?.status === 'valid' ?
								<OrcidInfo
									loading={false}
									person={item?.data}
								/>
							:	<span className="text-error">
									{generateErrorMessage(item)}
								</span>
						}
					/>
				</ListItem>,
			);
		});
		// debugger
		return html;
	}

	return (
		<>
			<ImportDialogTitle
				title={`Selection report (${selectedCnt} of ${validationReport?.size ?? 0} items)`}
			/>
			<DialogContent>
				<List>{renderListItems()}</List>
			</DialogContent>
			<ImportDialogActions>
				<Button
					tabIndex={1}
					onClick={onCancel}
					color="secondary"
					sx={{marginRight: '2rem'}}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					endIcon={<PostAddIcon />}
					tabIndex={0}
					disabled={selectedCnt === 0}
					onClick={startImport}
				>
					Import
				</Button>
			</ImportDialogActions>
		</>
	);
}
