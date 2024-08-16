// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';

import ImportDialogTitle from '~/components/mention/ImportMentions/ImportDialogTitle';
import ImportDialogActions from '~/components/mention/ImportMentions/ImportDialogActions';
import {
	OrcidBulkImportReport,
	useValidateOrcidList,
} from './apiImportOrcidList';
import config from './config';

type OrcidInputDialogBodyProps = {
	onCancel: () => void;
	onSubmit: (validationResults: OrcidBulkImportReport) => void;
};

export default function OrcidInputBody({
	onCancel,
	onSubmit,
}: OrcidInputDialogBodyProps) {
	const [value, setValue] = useState<string>('');
	const [error, setError] = useState({
		count: 0,
		message: '',
	});
	const {validating, validateInput} = useValidateOrcidList();

	async function onValidateInput() {
		const searchResults = await validateInput(value);
		onSubmit(searchResults);
	}

	function onSetValue({target}: {target: any}) {
		const count = target.value.split(/\r\n|\n|\r/).length;
		if (count > config.orcidInput.maxRows) {
			setError({
				count,
				message: `${config.orcidInput.maxRowsErrorMsg} `,
			});
		} else {
			setError({
				count,
				message: '',
			});
		}
		setValue(target.value);
	}

	return (
		<>
			<ImportDialogTitle title={'Import ORCID users'} />
			<DialogContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: '0rem 1rem',
				}}
			>
				<TextField
					multiline={true}
					fullWidth={true}
					sx={{
						flex: 1,
						margin: '1rem 0rem',
						'& .MuiInputBase-root': {
							flex: 1,
							alignItems: 'stretch',
							padding: '0.75rem 0.25rem 0.75rem 1rem',
						},
					}}
					value={value}
					label={config.orcidInput.label}
					error={error.message !== ''}
					onChange={onSetValue}
				></TextField>
			</DialogContent>
			<ImportDialogActions>
				<div
					className={`flex-1 flex gap-4 text-sm ${error.message ? 'text-error ' : 'text-base-content-disabled'}`}
				>
					<span>
						{error.message ?
							error.message
						:	config.orcidInput.helperText}
						...{`${error.count}/${config.orcidInput.maxRows}`}
					</span>
				</div>
				<div>
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
						endIcon={<NavigateNextIcon />}
						tabIndex={0}
						disabled={value.length === 0 || error.message !== ''}
						onClick={onValidateInput}
					>
						Next
					</Button>
				</div>
			</ImportDialogActions>
			{validating && (
				<Box
					sx={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
						cursor: 'wait',
						zIndex: 1,
					}}
				/>
			)}
		</>
	);
}
