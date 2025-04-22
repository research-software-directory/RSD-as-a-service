// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
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
    <article className="flex-1 border rounded-xs relative">
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
        id={'markdown-tabpanel-0'}
        role="tabpanel"
        hidden={tab !== 0}
        style={{
          padding:'1rem 0.25rem 0rem 0.25rem',
        }}
      >
        <textarea
          autoFocus={autofocus}
          disabled={disabled}
          name="markdown-input"
          id="markdown-textarea"
          rows={30}
          className="text-base-content w-full h-full px-8 font-mono text-sm min-h-[10rem]"
          {...register}
          onBlur={onBlur}
        ></textarea>
      </div>
      <div
        id={'markdown-tabpanel-1'}
        role="tabpanel"
        hidden={tab!==1}
        style={{padding:'1rem 0.25rem 4rem 0.25rem'}}
      >
        <ReactMarkdownWithSettings
          className='px-8'
          markdown={markdown}
        />
      </div>
    </article>
  )
}
