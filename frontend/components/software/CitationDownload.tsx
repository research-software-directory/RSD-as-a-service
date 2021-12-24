import {useState} from 'react'
import {SelectChangeEvent} from '@mui/material/Select'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import CiteDropdown from './CiteDropdown'
import {SoftwareCitationContent} from '../../types/SoftwareCitation'
import {citationFormats} from './citationFormats'

function getAvailableFormats(citation:SoftwareCitationContent){
  const valid = citationFormats.map(item=>{
    let disabled=false
    if (citation.hasOwnProperty(item.value)===false){
      disabled=true
    }
    return {
      ...item,
      disabled
    }
  })
  return valid
}

export default function CitationFormat({citation}:{citation:SoftwareCitationContent}) {
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
        options={getAvailableFormats(citation)}
        value={format}
        onChange={onFormatChange}
      />
      <Button
        disabled={format===''}
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
