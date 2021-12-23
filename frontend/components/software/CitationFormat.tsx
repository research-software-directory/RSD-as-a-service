import {useState} from 'react'
import {SelectChangeEvent} from '@mui/material/Select'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import CiteDropdown, {SelectOption} from './CiteDropdown'

const formats = [
  {label:'BibTex',value:'0'},
  {label:'EndNote',value:'1'},
  {label:'RIS',value:'2'},
  {label:'CodeMeta',value:'3'},
  {label:'Citation File Format',value:'4'}
]

export default function CitationFormat() {
  const [format,setFormat]=useState('')

  function onFormatChange({target}:{target:SelectChangeEvent['target']}){
    setFormat(target?.value)
  }

  function downloadFile(){
    console.log('Download...format...', format)
    alert('Implement file download')
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <CiteDropdown
        label="Choose a reference manager format:"
        options={formats}
        value={format}
        onChange={onFormatChange}
      />
      <Button
        sx={{
          display:'flex',
          justifyContent:'flex-start',
          minWidth:['100%','13rem'],
          ml:[null,2],
          p:2,
        }}
        onClick={downloadFile}
      >
        <DownloadIcon sx={{mr:1}}/>
          Download file
      </Button>
    </div>
  )
}
