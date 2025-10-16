// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useContext} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import ClearIcon from '@mui/icons-material/Clear'

import SearchContext from './SearchContext'

export default function Searchbox() {
  const {searchInput,setSearchInput,placeholder,setSearchFor} = useContext(SearchContext)

  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder={placeholder}
      value={searchInput}
      sx={{
        flex:1,
        minWidth: '15rem'
      }}
      onChange={({target})=>{
        setSearchInput(target.value)
      }}
      onKeyDown={(event)=>{
        // pass search value on enter
        if (event.key.toLowerCase()==='enter'){
          setSearchFor(searchInput)
        }
      }}
      // DEPRECATED
      // onKeyPress={(event)=>{
      //   // pass search value on enter
      //   if (event.key.toLowerCase()==='enter'){
      //     setSearchFor(searchInput)
      //   }
      // }}
      /* Icon search for the input */
      // startAdornment={
      //   <InputAdornment position="start">
      //     <SearchIcon
      //       sx={{cursor: 'pointer'}}
      //       onClick={() => setSearchFor(searchInput)} />
      //   </InputAdornment>
      // }
      endAdornment={
        <InputAdornment position="start">
          {searchInput ?
            <ClearIcon
              sx={{cursor:'pointer'}}
              onClick={()=>{
                setSearchInput('')
              }}
            />
            :null
          }
        </InputAdornment>
      }
    />
  )
}
