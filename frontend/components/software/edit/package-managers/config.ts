// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

export const config = {
	title: 'Package managers',
	modal: {
		url: {
			label: 'URL',
			help: 'Provide link to your package.',
			validation: {
				required: 'Link to your software package is required',
				maxLength: {
					value: 200,
					message: 'Maximum length is 200',
				},
				pattern: {
					value: /^https?:\/\/.+\..+/,
					message:
						'URL should start with http(s):// and use at least one dot (.)',
				},
			},
		},
	},
};
