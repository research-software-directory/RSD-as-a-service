// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Profile} from '~/types/Contributor';

type UseContributorListProps = {
	items: Profile[];
	limit: number;
};

export default function useContributorList({
	items,
	limit = 12,
}: UseContributorListProps) {
	let persons: Profile[] = [];

	if (limit >= items.length && persons.length < items.length) {
		persons = [...items];
	}

	if (limit < items.length && persons.length !== limit) {
		persons = items.slice(0, limit);
	}

	// console.group('useContributorList')
	// console.log('items...', items)
	// console.log('persons...', persons)
	// console.log('limit...', limit)
	// console.groupEnd()

	return {
		persons,
		hasMore: persons?.length < items?.length,
	};
}
