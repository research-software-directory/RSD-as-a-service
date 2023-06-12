// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react'
import {ClickAwayListener} from '@mui/base'
import {useRouter} from 'next/router'

import {useAuth} from '~/auth'
import {getGlobalSearch,GlobalSearchResults} from '~/components/GlobalSearchAutocomplete/globalSearchAutocomplete.api'

import EnterkeyIcon from '~/components/icons/enterkey.svg'
import {useDebounce} from '~/utils/useDebounce'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BusinessIcon from '@mui/icons-material/Business'

type Props = {
  className?: string
}

export default function GlobalSearchAutocomplete(props: Props) {
  const {session} = useAuth()
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState(0)
  const [hasResults, setHasResults] = useState(true)
  const [searchResults, setSearchResults] = useState<GlobalSearchResults[]>([])

  const lastValue = useDebounce(inputValue, 150)

  // console.group('GlobalSearchAutocomplete')
  // console.log('inputValue...', inputValue)
  // console.log('lastValue...', lastValue)
  // console.log('searchResults...',searchResults)
  // console.groupEnd()

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
        className={`${props.className} relative z-10 flex w-full xl:w-[14.5rem] xl:max-w-[20rem] focus-within:w-full duration-700`}>
        <div className="absolute top-[14px] left-3 pointer-events-none">
          {/* Search Icon */}
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.72217 0.34082C2.86783 0.34082 0.559204 2.64944 0.559204 5.50378C0.559204 8.35812 2.86783 10.6667 5.72217 10.6667C6.74123 10.6667 7.68438 10.3678 8.48397 9.86003L12.2138 13.5899L13.5046 12.2992L9.82216 8.62624C10.4841 7.75783 10.8851 6.68182 10.8851 5.50378C10.8851 2.64944 8.57651 0.34082 5.72217 0.34082ZM5.72217 1.55564C7.90859 1.55564 9.67031 3.31735 9.67031 5.50378C9.67031 7.69021 7.90859 9.45193 5.72217 9.45193C3.53574 9.45193 1.77402 7.69021 1.77402 5.50378C1.77402 3.31735 3.53574 1.55564 5.72217 1.55564Z"
              fill="#707070"/>
          </svg>
        </div>
        <input className="px-2 pl-8 py-2 bg-transparent rounded-sm border border-white border-opacity-50 focus:outline-0 w-full focus:bg-white focus:text-black duration-200"
          data-testid="global-search"
          placeholder="Search or jump to..."
          autoComplete="off"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type="text"
          onFocus={focusSearch}
        />

        {isOpen &&
          <div
            data-testid="global-search-list"
            className="shadow-xl absolute top-[50px] w-full left-0 bg-white text-black py-2 rounded-sm"
            style={{
              maxHeight: '50vh',
              overflow: 'auto'
            }}
          >
            {!hasResults &&
              <div className="px-4 py-3 font-normal bg-base-200 mb-2 ">
                <span className="animate-pulse">No results...</span>
              </div>}
            {searchResults.map((item, index) =>
              <div key={index}
                data-testid="global-search-list-item"
                className={`${selected === index ? 'bg-base-200' : ''} flex gap-2 p-2 cursor-pointer transition justify-between items-center`}
                onClick={handleClick}
                onMouseEnter={() => setSelected(index)}
                onTouchStart={() => setSelected(index)}
              >
                <div className="flex gap-3 w-full">
                  {/*icon*/}
                  <div className={selected === index ? 'text-content' : 'opacity-40'}>
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

                  {selected === index && <div>
                    <EnterkeyIcon/>
                  </div>}
                </div>
              </div>
            )}
          </div>
        }
      </div>

    </ClickAwayListener>
  )
}
