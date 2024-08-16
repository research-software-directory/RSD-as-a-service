// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Pagination from '~/components/pagination/Pagination';
import Searchbox from '~/components/search/Searchbox';
import OrcidUserList from './OrcidUserList';
import ImportOrcidList from './ImportOrcidList';
import {useOrcidList} from './apiOrcidUsers';

export default function OrcidUsersPage() {
	const {searchFor, loading, persons, addOrcid, removeOrcid, loadOrcidList} =
		useOrcidList();
	return (
		<section className="flex-1">
			<div className="flex flex-wrap items-center justify-end">
				<ImportOrcidList loadOrcidList={loadOrcidList} />
				<Searchbox />
				<Pagination />
			</div>
			<OrcidUserList
				searchFor={searchFor}
				loading={loading}
				persons={persons ?? []}
				addOrcid={addOrcid}
				removeOrcid={removeOrcid}
			/>
		</section>
	);
}
