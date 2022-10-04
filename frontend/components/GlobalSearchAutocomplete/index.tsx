// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react'
import {ClickAwayListener} from '@mui/base'
import {useRouter} from 'next/router'
import {getGlobalSearch} from '~/components/GlobalSearchAutocomplete/globalSearchAutocomplete.api'
import {useAuth} from '~/auth'

import EnterkeyIcon from '~/components/icons/enterkey.svg'
import {useDebounce} from '~/utils/useDebounce'

import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'

type Props = {
  className?: string
}

export default function GlobalSearchAutocomplete(props: Props) {
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState(0)
  const [hasResults, setHasResults] = useState(true)
  const [searchResults, setSearchResults] = useState<GlobalSearchResults[]>([])

  const lastValue = useDebounce(inputValue, 150)
  const {session} = useAuth()
  useEffect(() => {
    if (inputValue === '') {
      setOpen(false)
      setSelected(0)
      setSearchResults([])
    }
  }, [inputValue])

  useEffect(() => {
    if (lastValue.length > 0) {
      setOpen(true)
      fetchData(lastValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastValue])

  const defaultValues = [
    {name: 'Go to Software page', slug: '', source: 'software'},
    {name: 'Go to Projects page', slug: '', source: 'projects'},
    {name: 'Go to Organisations page', slug: '', source: 'organisations'},
  ]

  async function fetchData(search: string) {
    // Fetch api
    const data = await getGlobalSearch(search, session.token) || []

    if (data?.length === 0) {
      setHasResults(false)
      setSearchResults(defaultValues)
    } else {
      setHasResults(true)
      setSearchResults(data)
    }
  }

  function handleClick() {
    const slug = searchResults[selected]?.slug !== '' ? ('/' + searchResults[selected]?.slug) : ''
    router.push(`/${searchResults[selected]?.source}${slug}`)
    setSelected(0)
    setOpen(false)
    setInputValue('')
  }

  // Handle keyup
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Handle arrow up and down
    switch (e.keyCode) {
      // Close menu on lost focus with tab key
      case 9:
        setOpen(false)
        break
      // Backspace - Remove selection
      case 8:
        setSelected(0)
        break
      // Up arrow
      case 38:
        e.preventDefault() // Disallows the cursor to move to the end of the input
        selected > 0 && setSelected(selected - 1)
        break
      // Down arrow
      case 40:
        e.preventDefault() // Disallows the cursor to move to the end of the input
        searchResults.length - 1 > selected && setSelected(selected + 1)
        break
      // Enter
      case 13:
        handleClick()
        break
      // Escape key
      case 27:
        setOpen(false)
        break
    }
  }

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const search = e.currentTarget.value
    // Update state
    setInputValue(search)
  }

  function focusSearch() {
    setOpen(true)
    if (inputValue === '') {
      setSearchResults(defaultValues)
    }
  }

  return (
    <ClickAwayListener onClickAway={() => {
      setOpen(false)
    }}>

      <div
        className={`${props.className} relative z-10 flex w-full md:w-48 md:max-w-[320px] focus-within:w-full duration-700`}>
        <input className="px-3 py-2 bg-transparent rounded-sm border border-white border-opacity-50 focus:outline-0
                          w-full focus:bg-white focus:text-black
                          duration-200"
               placeholder="Search or jump to..."
               autoComplete="off"
               value={inputValue}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
               type="search"
               onFocus={focusSearch}
        />

        {isOpen &&
          <div
            className="shadow-xl absolute top-[50px] w-full left-0 bg-white text-black py-2 rounded">
            {!hasResults && <div className="px-4 py-3 font-normal bg-gray-200 mb-2 "><span
              className="animate-pulse">No results...</span></div>}
            {searchResults.map((item, index) =>
              <div key={index}
                   className={`${selected === index ? 'bg-secondary text-secondary-content' : ''} flex gap-2 p-2 cursor-pointer transition justify-between items-center`}
                   onClick={handleClick}
                   onMouseEnter={() => setSelected(index)}
              >
                <div className="flex gap-3 w-full">
                  {/*icon*/}
                  <div className={selected === index ? 'text-content' : 'text-gray-500'}>
                    {item?.source === 'software' && <TerminalIcon/>}
                    {item?.source === 'projects' && <ListAltIcon/>}
                    {item?.source === 'organisations' && <BusinessIcon/>}
                  </div>

                  <div className="flex-grow ">
                    <div className="font-normal line-clamp-1">{item?.name}</div>

                    <div className="text-xs text-current text-opacity-40">
                      {item?.source}{item?.is_published === false && <span
                      className="flex-nowrap border px-1 py-[2px] rounded bg-warning ml-3 text-xs text-warning-content">unpublished</span>}
                    </div>

                  </div>

                  {selected === index &&
                    <div>
                      <EnterkeyIcon/>
                    </div>
                  }
                </div>
              </div>
            )}
          </div>
        }
      </div>

    </ClickAwayListener>
  )
}
