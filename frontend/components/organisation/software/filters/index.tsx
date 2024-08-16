// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader';

import {decodeJsonParam} from '~/utils/extractQueryParam';
import useQueryChange from '~/components/organisation/projects/useQueryChange';
import KeywordsFilter from '~/components/filter/KeywordsFilter';
import ProgrammingLanguagesFilter from '~/components/filter/ProgrammingLanguagesFilter';
import LicensesFilter from '~/components/filter/LicensesFilter';

import OrgOrderSoftwareBy from './OrgOrderSoftwareBy';
import useSoftwareParams from './useSoftwareParams';
import useOrgSoftwareKeywordsList from './useOrgSoftwareKeywordsList';
import useOrgSoftwareLicensesList from './useOrgSoftwareLicensesList';
import useOrgSoftwareLanguagesList from './useOrgSoftwareLanguagesList';

export default function OrgSoftwareFilters() {
	const {resetFilters, handleQueryChange} = useQueryChange();
	const {filterCnt, keywords_json, prog_lang_json, licenses_json} =
		useSoftwareParams();
	const {keywordsList} = useOrgSoftwareKeywordsList();
	const {languagesList} = useOrgSoftwareLanguagesList();
	const {licensesList} = useOrgSoftwareLicensesList();

	const keywords = decodeJsonParam(keywords_json, []);
	const prog_lang = decodeJsonParam(prog_lang_json, []);
	const licenses = decodeJsonParam(licenses_json, []);

	// debugger
	function clearDisabled() {
		if (filterCnt && filterCnt > 0) return false;
		return true;
	}

	return (
		<>
			<FilterHeader
				filterCnt={filterCnt}
				disableClear={clearDisabled()}
				resetFilters={() => resetFilters('software')}
			/>
			{/* Order by */}
			<OrgOrderSoftwareBy />
			{/* Keywords */}
			<div>
				<KeywordsFilter
					keywords={keywords}
					keywordsList={keywordsList}
					handleQueryChange={handleQueryChange}
				/>
			</div>
			{/* Program languages */}
			<div>
				<ProgrammingLanguagesFilter
					prog_lang={prog_lang}
					languagesList={languagesList}
					handleQueryChange={handleQueryChange}
				/>
			</div>
			{/* Licenses */}
			<div>
				<LicensesFilter
					licenses={licenses}
					licensesList={licensesList}
					handleQueryChange={handleQueryChange}
				/>
			</div>
		</>
	);
}
