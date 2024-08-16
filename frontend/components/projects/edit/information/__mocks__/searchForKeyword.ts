// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type Keyword = {
	id: string;
	keyword: string;
	cnt: number | null;
};

export type NewKeyword = {
	id: null;
	keyword: string;
};

// DEFAULT MOCK
export async function searchForProjectKeyword({
	searchFor,
}: {
	searchFor: string;
}) {
	// console.log('searchForProjectKeyword...default MOCK')
	return [];
}
