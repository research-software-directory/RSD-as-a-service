// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button';

export default function LinkOrcidButton({
	orcidAuthLink,
	disabled,
}: {
	orcidAuthLink: string | null;
	disabled: boolean;
}) {
	if (orcidAuthLink) {
		return (
			<Button
				disabled={disabled}
				href={orcidAuthLink}
				variant="contained"
				sx={{
					// we need to overwrite global link styling from tailwind
					// because the type of button is a link (we use href param)
					':hover': {
						color: 'primary.contrastText',
					},
				}}
			>
				Link your ORCID account
			</Button>
		);
	}
	return null;
}
