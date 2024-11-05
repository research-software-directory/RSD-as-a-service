// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect} from 'react'
import {useDebounce} from '~/utils/useDebounce'
import TextField from '@mui/material/TextField'

type SearchInputProps = {
  placeholder: string,
  onSearch: (search:string)=>void,
  delay?: number,
  defaultValue?: string,
}

export default function SearchInput({
  placeholder,
  onSearch,
  delay = 700,
  defaultValue = ''
}: SearchInputProps) {
  const [state, setState] = useState({
    value: defaultValue ?? '',
    wait: true
  })
  const searchFor = useDebounce(state.value, delay)

  useEffect(() => {
    if ((searchFor !== '' && defaultValue === '') || defaultValue !== '') {
      setState({value: defaultValue, wait: true})
    }
  }, [searchFor, defaultValue])

  useEffect(() => {
    let abort = false
    const {wait, value} = state
    if (!wait && value === searchFor) {
      if (abort) return
      setState({
        wait: true,
        value
      })
      onSearch(searchFor)
    }
    return () => {
      abort = true
    }
  }, [state, searchFor, onSearch])

  return (
    <TextField
      size="small"
      type="text"
      placeholder={placeholder}
      value={state.value}
      onChange={({target}) => setState({value: target.value, wait: false})}
      sx={{
        // width: '100%',
        flex: 1,
        margin: '0rem 0.5rem 0rem 0rem',
        backgroundColor: 'background.paper',
        '.MuiInputBase-root': {
          flex: 1
        },
        '.MuiOutlinedInput-notchedOutline': {
          border: 0
        }
      }}
    />
  )
}
