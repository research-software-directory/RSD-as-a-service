// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ForwardedRef} from 'react'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useSoftwareFilterPanel from '~/components/softwarePage/useSoftwarefilterPanel'

// Ref needed to emebd a custom component inside a MUI modal:
// https://mui.com/material-ui/guides/composition/#caveat-with-refs
type Ref = {
  ref?: ForwardedRef<unknown>
}

export default function SoftwareFilterPanel({ref}: Ref) {
  const {
    keywords,
    keywordsList,
    languages,
    languagesList,
    licenses,
    licensesList,
    handleQueryChange,
    orderBy, setOrderBy,
    getFilterCount,
    resetFilters
  } = useSoftwareFilterPanel()

  // @ts-ignore
  return <div ref={ref} className="flex bg-white m-4 p-4 shadow rounded-md flex-col gap-8 max-w-[230px]">
    <div className="flex">
      <div className="flex justify-center items-center gap-2 mr-12">
        <span
          className="rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center font-semibold">
          {getFilterCount()}
        </span>
        Filters
      </div>

      <Button
        size="small"
        onClick={resetFilters}
        disabled={getFilterCount() === 0}
        className="bg-red-200 ml-44"
        variant="outlined"
        color="primary"
      >
        Clear
      </Button>
    </div>

    {/* Order by */}
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-label">Order by</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={orderBy}
        label="Order by"
        onChange={(e) => {
          setOrderBy(e.target.value)
          handleQueryChange('order', e.target.value)
        }}
      >
        <MenuItem value={'contributor_cnt'}>Contributions</MenuItem>
        <MenuItem value={'mention_cnt'}>Mentions</MenuItem>
      </Select>
    </FormControl>

    {/* Keywords */}
    <div>
      <div className="flex justify-between items-center">
        <div className="font-semibold">Keywords</div>
        <div className="text-sm opacity-60">{keywordsList.length}</div>
      </div>
      <Autocomplete
        className="mt-4"
        value={keywords}
        size="small"
        multiple
        clearOnEscape
        options={keywordsList}
        getOptionLabel={(option) => (option.keyword)}
        isOptionEqualToValue={(option, value) => {
          return option.keyword === value.keyword
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <li className="flex w-full items-center content-between" {...props} >
            <div className="text-sm flex-1">{
              option.keyword
            }</div>
            <div className="text-xs opacity-60">({
              option.cnt
            })
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Keywords"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.keyword)
          handleQueryChange('keywords', queryFilter)
        }}
      />
    </div>

    {/* Programme Languages */}
    <div>
      <div className="flex justify-between items-center">
        <div className="font-semibold">Program languages</div>
        <div className="text-sm  opacity-60">{languagesList.length}</div>
      </div>
      <Autocomplete
        className="mt-4"
        value={languages}
        size="small"
        multiple
        clearOnEscape
        options={languagesList}
        getOptionLabel={(option) => option.prog_lang}
        isOptionEqualToValue={(option, value) => {
          return option.prog_lang === value.prog_lang
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <li className="flex w-full items-center content-between" {...props} >
            <div className="text-sm flex-1">{
              option.prog_lang
            }</div>
            <div className="text-xs opacity-60">({
              option.cnt
            })
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Program languages"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.prog_lang)
          // update query url
          handleQueryChange('prog_lang', queryFilter)
        }}
      />
    </div>

    {/* Licenses */}
    <div>
      <div className="flex justify-between items-center">
        <div className="font-semibold">Licenses</div>
        <div className="text-sm opacity-60">{licensesList.length}</div>
      </div>
      <Autocomplete
        className="mt-4"
        value={licenses}
        size="small"
        multiple
        clearOnEscape
        options={licensesList}
        getOptionLabel={(option) => option.license}
        isOptionEqualToValue={(option, value) => {
          return option.license === value.license
        }}
        defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <li className="flex items-center w-full content-between" {...props} >
            <div className="flex-1 text-sm">{option.license}</div>
            <div className="text-xs opacity-60">({option.cnt})</div>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder="Licenses"/>
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          const queryFilter = newValue.map(item => item.license)
          // update query url
          handleQueryChange('licenses', queryFilter)
        }}
      />
    </div>
  </div>
}