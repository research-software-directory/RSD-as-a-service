// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {useOrcidName} from './apiOrcidUsers';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ContentLoader from '~/components/layout/ContentLoader';

type AddOrcidAlertProps = {
	readonly orcid: string;
	addOrcid: (orcid: string) => void;
};

export default function AddOrcidAlert({orcid, addOrcid}: AddOrcidAlertProps) {
	const {loading, ...person} = useOrcidName(orcid);

	if (loading)
		return (
			<section className="flex-1 py-4">
				<ContentLoader />
			</section>
		);

	// We cannot find this ORCID
	if (typeof person['orcid-id'] == 'undefined') {
		return (
			<section className="flex-1">
				<Alert
					severity="error"
					action={
						<Button
							startIcon={<AddIcon />}
							onClick={() => {
								addOrcid(orcid);
							}}
							sx={{
								marginLeft: '1rem',
							}}
						>
							Add
						</Button>
					}
					sx={{
						marginTop: '0.5rem',
					}}
				>
					<AlertTitle sx={{fontWeight: 500}}>
						ORCID does not exist
					</AlertTitle>
					Please validate the ORCID value. If you are sure that value
					is valid use Add button.
				</Alert>
			</section>
		);
	}

	return (
		<section className="flex-1">
			<Alert
				severity="success"
				action={
					<Button
						startIcon={<AddIcon />}
						onClick={() => {
							if (person['orcid-id'])
								addOrcid(person['orcid-id']);
						}}
						sx={{
							marginLeft: '1rem',
						}}
					>
						Add
					</Button>
				}
				sx={{
					marginTop: '0.5rem',
				}}
			>
				<AlertTitle sx={{fontWeight: 500}}>Not found in RSD</AlertTitle>
				<p className="py-2">Use add button to add this ORCID.</p>
				<table>
					<tbody>
						<tr>
							<td valign="top">ORCID</td>
							<td>
								<strong>{person['orcid-id']}</strong>
							</td>
						</tr>
						<tr>
							<td valign="top">Name</td>
							<td>
								<strong>{`${person['given-names'] ?? ''} ${person['family-names'] ?? ''}`}</strong>
							</td>
						</tr>
						<tr>
							<td valign="top">Affiliation(s)</td>
							<td>
								{person['institution-name']?.map(item => {
									return <p key={item}>{item}</p>;
								})}
							</td>
						</tr>
					</tbody>
				</table>
			</Alert>
		</section>
	);
}
