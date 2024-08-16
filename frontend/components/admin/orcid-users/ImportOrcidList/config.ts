// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const maxRows = 50;

const config = {
	orcidInput: {
		label: 'Provide one ORCID per line',
		helperText: 'Provide one ORCID per line',
		maxRowsErrorMsg: 'Maximum number of items exceeded',
		maxRows,
	},
};

export default config;
