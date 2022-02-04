import {useState, useRef, useEffect} from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'

export default function MarkdownInputWithPreview({markdown,register,disabled=true,autofocus=false}:
  { markdown:string, register: any, disabled?:boolean,autofocus?:boolean }) {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    // NOTE! useRef seems not to work properly when used
    // in combination with react-form-hook
    // this is quickfix using object id
    const textInput = document.getElementById('markdown-textarea')
    if (textInput) {
      const height = textInput.scrollHeight
      if (height > 432) {
        textInput.style.height = `${height}px`
      } else {
        // default height
        textInput.style.height = '432px'
      }
    }
  }, [])

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

  return (
    <article className="border rounded-sm min-h-[33rem]">
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="Tabs"
        sx={{
          padding:'1rem 2rem'
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
          className="text-secondary w-full h-full py-4 px-8 font-mono text-sm"
          onInput={({target}:{target:any}) => {
            target.style.height = ''
            target.style.height = target.scrollHeight + 'px'
          }}
          {...register}
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
