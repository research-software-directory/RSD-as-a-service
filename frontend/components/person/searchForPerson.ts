// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {sortBySearchFor} from '~/utils/sortFn';
import logger from '~/utils/logger';
import {rsdUniquePersonEntries} from '~/utils/findRSDPerson';
import {searchORCID} from '~/utils/getORCID';
import {groupByOrcid, personsToAutocompleteOptions} from './groupByOrcid';

export async function searchForPerson({
	searchFor,
	token,
}: {
	searchFor: string;
	token: string;
}) {
	try {
		const [rsdPersons, orcidPersons] = await Promise.all([
			rsdUniquePersonEntries({searchFor, token}),
			searchORCID({searchFor}),
		]);

		const persons = groupByOrcid(rsdPersons, orcidPersons);
		const sortedPersons = persons.sort((a, b) =>
			sortBySearchFor(a, b, 'display_name', searchFor),
		);
		const options = personsToAutocompleteOptions(sortedPersons);

		// console.log('searchForPerson...options...', options)

		return options;
	} catch (e: any) {
		logger(`searchForPerson: ${e?.message}`, 'error');
		return [];
	}
}
