// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/filter/FilterTitle'
import FilterOption from '~/components/filter/FilterOption'

export type CategoryOption = {
  category: string,
  category_cnt: number
}

type CategoryFilterProps = Readonly<{
  categories: string[],
  categoryList: CategoryOption[]
  handleQueryChange: (key: string, value: string | string[]) => void
  title?: string
}>

export default function CategoriesFilter({categories,categoryList,handleQueryChange,title='Categories'}: CategoryFilterProps) {

  const [selected, setSelected] = useState<CategoryOption[]>([])
  const [options, setOptions] = useState<CategoryOption[]>(categoryList)

  // console.group('CategoryFilter')
  // console.log('categoryList...', categoryList)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (categories.length > 0 && categoryList.length) {
      const selectedCategories = categoryList.filter(option => {
        return categories.includes(option.category)
      })
      setSelected(selectedCategories)
    } else {
      setSelected([])
    }
    setOptions(categoryList)
  },[categories,categoryList])

  return (
    <>
      <FilterTitle
        title={title}
        count={categoryList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => (option.category)}
        isOptionEqualToValue={(option, value) => {
          return option.category === value.category
        }}
        defaultValue={[]}
        filterSelectedOptions
        // remove key from other props
        renderOption={({key,...props}, option) => (
          <FilterOption
            key={key ?? option.category}
            props={props}
            label={option.category}
            count={option.category_cnt}
            capitalize={false}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.category)
          handleQueryChange('categories', queryFilter)
        }}
      />
    </>
  )
}
