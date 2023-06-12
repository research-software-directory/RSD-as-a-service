// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import {useDebounce} from '~/utils/useDebounce'
import ClearIcon from '@mui/icons-material/Clear'

type SearchboxProps = {
  placeholder: string,
  onSearch: Function,
  delay?: number,
  defaultValue?:string
}

export default function Searchbox({placeholder, onSearch, delay = 400, defaultValue=''}: SearchboxProps) {
  const [state,setState]=useState({
    value:defaultValue ?? '',
    wait:true
  })
  const searchFor=useDebounce(state.value,delay)

  useEffect(() => {
    let abort = false
    const {wait,value} = state
    if (wait === false && value === searchFor) {
      if (abort) return
      setState({
        wait:true,
        value
      })
      onSearch(searchFor)
    }
    return () => { abort = true }
  },[state,searchFor,onSearch])

  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder={placeholder}
      value={state.value}
      sx={{
        flex:1,
        minWidth: ['auto','auto', '20rem']
      }}
      onChange={({target})=>{
        setState({
          value:target.value,
          wait:false
        })
      }}
      onKeyPress={(event)=>{
        if (event.key.toLowerCase() === 'enter') {
          // pass search value on enter
          setState({
            value:state.value,
            wait:false
          })
        }
      }}
      /* Icon search for the input */
      // startAdornment={
      //   <InputAdornment position="start">
      //     <SearchIcon sx={{cursor:'pointer'}} onClick={()=>onSearch(searchFor)} />
      //   </InputAdornment>
      // }
      endAdornment={
        <InputAdornment position="start">
          {searchFor ?
            <ClearIcon
              sx={{cursor:'pointer'}}
              onClick={()=>{
                setState({
                  value:'',
                  wait:false
                })
              }}
            />
            :null
          }
        </InputAdornment>
      }
    />
  )
}
