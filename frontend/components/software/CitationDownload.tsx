import {useState} from 'react'
import {useRouter} from 'next/router'
import {SelectChangeEvent} from '@mui/material/Select'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import CiteDropdown from './CiteDropdown'
import {SoftwareCitationContent} from '../../types/SoftwareCitation'
import {citationFormats, CitationFormatType} from './citationFormats'

function getAvailableFormats(citation:SoftwareCitationContent){
  const valid = citationFormats.map((item,pos)=>{
    let disabled=false
    if (citation.hasOwnProperty(item.format)===false){
      disabled=true
    }
    return {
      ...item,
      disabled,
      value: pos.toString()
    }
  })
  return valid
}

export default function CitationFormat({citation}: { citation: SoftwareCitationContent }) {
  const router = useRouter()
  const [format,setFormat]=useState({v:'',f:'',e:'',t:'',n:''})
  const options = getAvailableFormats(citation)

  function getFileName(option: CitationFormatType) {
    const {slug} = router.query
    switch (option.format) {
      case 'bibtex':
      case 'endnote':
      case 'ris':
        return `${slug}.${option.ext}`
      case 'codemeta':
        return 'codemeta.json'
      case 'cff':
        return 'CITATION.cff'
      default:
        return `${option.format}.${option.ext}`
    }
  }

  function onFormatChange({target}:{target:SelectChangeEvent['target']}){
    if (target?.value) {
      setFormat({
        v: target?.value,
        f: options[parseInt(target.value)].format,
        t: options[parseInt(target.value)].contentType,
        e: options[parseInt(target.value)].ext,
        n: getFileName(options[parseInt(target.value)])
      })
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <CiteDropdown
        label="Choose a reference manager format:"
        options={options}
        value={format.v}
        onChange={onFormatChange}
      />
      <Button
        disabled={format.v===''}
        sx={{
          display:'flex',
          justifyContent:'flex-start',
          minWidth:['100%','13rem'],
          ml:[null,2],
          p:2,
        }}
      >
        <DownloadIcon sx={{mr:1}}/>
        <a href={`/api/fe/cite/${citation.id}?f=${format.f}&t=${format.t}&n=${format.n}`}
          download={format.n}
        >
          Download file
        </a>
      </Button>
    </div>
  )
}
