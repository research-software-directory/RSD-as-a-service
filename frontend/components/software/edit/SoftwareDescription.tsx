import {useState} from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import ReactMarkdown from 'react-markdown'

export default function SoftwareDescription({markdown,onSave}:{markdown:string,onSave:Function}) {
  const [tab, setTab] = useState(0)
  const [localMarkdown, setMarkdown] = useState(markdown)
  const [touched, setTouched] = useState(false)

  function handleChange(event: React.SyntheticEvent, newValue: number){
    setTab(newValue)
  }

  return (
    <article>
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="Tabs">
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
          name="markdown-input"
          id="markdown-textarea"
          onChange={({target}) => {
            setMarkdown(target.value)
            setTouched(true)
          }}
          value={localMarkdown}
          onBlur={({target}) => {
            if (touched) {
              onSave(target.value)
              setTouched(false)
            }
          }}
        ></textarea>
      </div>
      <div
        id={`markdown-tabpanel-${tab}`}
        role="tabpanel"
        hidden={tab!==1}
      >
        <div>
          <ReactMarkdown
            className="prose"
          >
            {localMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  )
}
