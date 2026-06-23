// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/filter/FilterTitle'
import FilterOption from '~/components/filter/FilterOption'
import StatusForReaders from '~/components/a11y/StatusForReaders'
import {screenReaderFilterMsg, ariaOptionLabel} from './screenReaderFilterMsg'

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
  const include:string[] = []
  const selected:CategoryOption[] = []

  // split all categories to selected and to include (from other category filters)
  categories.forEach(item=>{
    const option = categoryList.find(option=>option.category===item)
    if (option){
      selected.push(option)
    }else{
      include.push(item)
    }
  })

  // console.group('CategoriesFilter')
  // console.log('categories...', categories)
  // console.log('categoryList...', categoryList)
  // console.log('selected...', selected)
  // console.log('include...', include)
  // console.groupEnd()

  const message = screenReaderFilterMsg({
    name: title,
    selected: selected.map(item => item.category),
    optionCnt: categoryList?.length
  })

  return (
    <>
      <FilterTitle
        title={title}
        count={categoryList.length ?? ''}
      />
      {/* a11y screen reader announcer */}
      <StatusForReaders message={message}/>
      <Autocomplete
        className="mt-4"
        disabled={categoryList?.length===0}
        value={selected}
        size="small"
        multiple
        clearOnEscape
        options={categoryList}
        getOptionLabel={(option) => (option.category)}
        isOptionEqualToValue={(option, value) => {
          return option.category === value.category
        }}
        defaultValue={[]}
        filterSelectedOptions
        // remove key from other props
        renderOption={({key,...props}, option) => {
          // a11y provide descriptive audio fallback for menu lines
          const accessibleOptionLabel = ariaOptionLabel({
            name: option.category,
            count: option.category_cnt
          })
          return (
            <FilterOption
              key={key ?? option.category}
              props={{
                ...props,
                'aria-label': accessibleOptionLabel
              }}
              label={option.category}
              count={option.category_cnt}
              capitalize={false}
            />
          )
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(_, newValue) => {
          // extract values into string[] for url query
          const queryFilter = [
            // integrate categories from other filters
            ...include,
            // add categories from this filter
            ...newValue.map(item => item.category)
          ]
          handleQueryChange('categories', queryFilter)
        }}
      />
    </>
  )
}
