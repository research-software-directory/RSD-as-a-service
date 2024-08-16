// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export function useLoginForAccount() {
	return {
		loading: false,
		accounts: [],
		orcidLogin: undefined,
		deleteLogin: jest.fn(),
	};
}
