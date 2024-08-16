// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import FilterTitle from '~/components/filter/FilterTitle';
import FilterOption from '~/components/filter/FilterOption';

export type KeywordFilterOption = {
	keyword: string;
	keyword_cnt: number;
};

type KeywordsFilterProps = {
	keywords: string[];
	keywordsList: KeywordFilterOption[];
	handleQueryChange: (key: string, value: string | string[]) => void;
	title?: string;
};

/**
 * Shared component used on software overview,
 * project overview, organisation/projects, organisation/software
 * pages
 */
export default function KeywordsFilter({
	keywords,
	keywordsList,
	handleQueryChange,
	title = 'Keywords',
}: KeywordsFilterProps) {
	const [selected, setSelected] = useState<KeywordFilterOption[]>([]);
	const [options, setOptions] = useState<KeywordFilterOption[]>(keywordsList);

	// console.group('KeywordsFilter')
	// console.log('keywordsList...', keywordsList)
	// console.log('options...', options)
	// console.groupEnd()

	useEffect(() => {
		if (
			keywords &&
			keywordsList &&
			keywords.length > 0 &&
			keywordsList.length > 0
		) {
			const selectedKeywords = keywordsList.filter(option => {
				return keywords.includes(option.keyword);
			});
			setSelected(selectedKeywords);
		} else {
			setSelected([]);
		}
		setOptions(keywordsList);
	}, [keywords, keywordsList]);

	return (
		<>
			<FilterTitle title={title} count={keywordsList.length ?? ''} />
			<Autocomplete
				className="mt-4"
				value={selected}
				size="small"
				multiple
				clearOnEscape
				options={options}
				getOptionLabel={option => option.keyword}
				isOptionEqualToValue={(option, value) => {
					return option.keyword === value.keyword;
				}}
				defaultValue={[]}
				filterSelectedOptions
				renderOption={(props, option) => (
					<FilterOption
						key={option.keyword}
						props={props}
						label={option.keyword}
						count={option.keyword_cnt}
					/>
				)}
				renderInput={params => (
					<TextField {...params} placeholder={title} />
				)}
				onChange={(event, newValue) => {
					// extract values into string[] for url query
					const queryFilter = newValue.map(item => item.keyword);
					handleQueryChange('keywords', queryFilter);
				}}
			/>
		</>
	);
}
