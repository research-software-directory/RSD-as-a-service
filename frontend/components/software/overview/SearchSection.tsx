// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useMediaQuery from '@mui/material/useMediaQuery'

import SearchInput from './SearchInput'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {setDocumentCookie} from './userSettings'

export type LayoutType = 'list'|'grid'|'masonry'

type SearchSectionProps = {
  page: number
  rows: number
  count: number
  placeholder: string
  layout: LayoutType
  search?: string
  resetFilters: () => void
  setModal: (modal: boolean) => void
  setView: (view:LayoutType)=>void
  handleQueryChange: (key: string, value: string | string[]) => void
}


export default function SearchSection({
  search, placeholder, page, rows, count, layout,
  handleQueryChange, setView, setModal
}: SearchSectionProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  return (
    <section>
      <div className="flex border rounded-md shadow-sm bg-base-100 p-2">
        <SearchInput
          placeholder={placeholder}
          onSearch={(search: string) => handleQueryChange('search', search)}
          defaultValue={search ?? ''}
        />
        <ToggleButtonGroup
          orientation="horizontal"
          value={layout}
          size="small"
          exclusive
          onChange={(e, view) => setView(view)}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          <ToggleButton value="masonry" aria-label="masonry">
            <ViewQuiltIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <FormControl
          size="small"
          sx={{
            minWidth: '4rem',
            backgroundColor: 'background.paper',
            paddingLeft: '0.5rem',
            '.MuiOutlinedInput-notchedOutline': {
              border: 0
            }
          }}
          title={`Show ${rows} items on page`}
        >
          {/* <InputLabel id="select-rows-label">Items</InputLabel> */}
          <Select
            id="demo-select-rows"
            labelId="select-rows-label"
            variant="outlined"
            value={rows ?? 12}
            // label="Items"
            onChange={({target}) =>{
              // console.log('rows...', target.value)
              handleQueryChange('rows', target.value.toString())
              // save to cookie
              setDocumentCookie(target.value.toString(),'rsd_page_rows')
            }}
            sx={{
              border: '1px solid #fff'
            }}
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={48}>48</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          Page {page ?? 1} of {count} results
        </div>
        {/* Filter button for mobile */}
        {smallScreen === true &&
          <Button
            onClick={() => setModal(true)}
            variant="outlined"
          >
            Filters
          </Button>
        }
      </div>
    </section>
  )
}
