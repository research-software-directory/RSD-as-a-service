// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect, FocusEventHandler} from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'

type MarkdownInputWithPreviewProps = {
  markdown: string,
  register: any,
  disabled?: boolean,
  autofocus?: boolean,
  helperInfo?: {
    length: number
    maxLength: number
  }
  onBlur?:(e:FocusEventHandler<HTMLTextAreaElement>)=>void
}

export default function MarkdownInputWithPreview({markdown, register, disabled = true,
  autofocus = false, helperInfo, onBlur}:MarkdownInputWithPreviewProps) {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    // NOTE! useRef seems not to work properly when used
    // in combination with react-form-hook
    // this is quickfix using object id
    const textInput = document.getElementById('markdown-textarea')
    if (textInput) {
      // save scroll position
      const scrollLeft = window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft
      const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      // reset height
      textInput.style.height = 'auto'
      // get new height
      const height = textInput.scrollHeight
      // assign the height
      if (height > 432) {
        textInput.style.height = `${height}px`
      } else {
        // default height
        textInput.style.height = '432px'
      }
      // recover scroll position
      window.scrollTo(scrollLeft, scrollTop)
    }
  }, [markdown])

  useEffect(() => {
    if (autofocus === true) {
      // NOTE! useRef seems not to work properly when used
      // in combination with react-form-hook
      // this is quickfix using object id
      const textInput = document.getElementById('markdown-textarea')
      if (textInput) {
        textInput.focus()
      }
    }
  },[autofocus])

  function handleChange(event: React.SyntheticEvent, newValue: number){
    setTab(newValue)
  }

  function getHelperTextMsg() {
    if (helperInfo)
      if (helperInfo?.length > helperInfo.maxLength) {
      return (
        <div className="py-[1rem] px-[2rem] text-xs text-error">
          {helperInfo?.length || 0}/{helperInfo?.maxLength}
        </div>
      )
    } else {
      return (
        <div className="py-[1rem] px-[2rem] text-xs opacity-70">
          {helperInfo?.length || 0}/{helperInfo.maxLength}
        </div>
      )
      }
    return null
  }

  return (
    <article className="border rounded-sm min-h-[33rem]">
      <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center">
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="Tabs"
          sx={{
            padding:['0.5rem 1rem','1rem 2rem']
          }}
        >
          <Tab
            id={`tab-${tab}`}
            label="Markdown"
            aria-controls={`markdown-tabpanel-${tab}`}
          />
          <Tab
            id={`tab-${tab}`}
            label="Preview"
            aria-controls={`markdown-tabpanel-${tab}`}
          />
        </Tabs>
        {getHelperTextMsg()}
      </div>
      <div
        id={`markdown-tabpanel-${tab}`}
        role="tabpanel"
        hidden={tab !== 0}
      >
        <textarea
          autoFocus={autofocus}
          disabled={disabled}
          name="markdown-input"
          id="markdown-textarea"
          rows={20}
          className="text-base-content w-full h-full pt-4 px-8 font-mono text-sm"
          {...register}
          onBlur={onBlur}
        ></textarea>
      </div>
      <div
        id={`markdown-tabpanel-${tab}`}
        role="tabpanel"
        hidden={tab!==1}
      >
        <div>
          <ReactMarkdownWithSettings
            className='py-4 px-8'
            markdown={markdown}
          />
        </div>
      </div>
    </article>
  )
}
