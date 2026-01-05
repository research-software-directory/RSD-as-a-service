// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useParams} from 'next/navigation'
import {SelectChangeEvent} from '@mui/material/Select'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import CiteDropdown from './CiteDropdown'
import {citationOptions} from './citationFormats'

function getAvailableOptions(){
  const values = Object.keys(citationOptions)
  const options = values.map(key => ({
    label: citationOptions[key].label,
    value: key
  }))

  return options
}

export default function CitationDownload({doi}: {doi:string}) {
  const params = useParams()
  const options = getAvailableOptions()
  const [selected, setSelected] = useState<string>()

  function getFileName(format: string) {
    const download = citationOptions[format]
    let baseName = format
    if (params?.slug) {
      baseName = params?.slug.toString()
    }
    return `${baseName}.${download.ext}`
  }

  function onFormatChange({target}: {target: SelectChangeEvent['target']}) {
    if (target?.value) {
      setSelected(target.value)
    }
  }

  function renderDownloadBtn(){
    if (!selected){
      // return disabled button
      return(
        <Button
          disabled={true}
          startIcon={<DownloadIcon />}
          sx={{
            display:'flex',
            justifyContent:'flex-start',
            minWidth:['15rem'],
            ml:[null,2],
            p:2,
          }}
        >
          Download citation
        </Button>
      )
    }
    const fileName = getFileName(selected)
    // return download link
    return (
      <Button
        startIcon={<DownloadIcon />}
        sx={{
          display:'flex',
          justifyContent:'flex-start',
          minWidth:['15rem'],
          ml:[null,2],
          p:2,
        }}
        href={`/api/fe/cite/?doi=${encodeURI(doi)}&f=${selected}&n=${encodeURI(fileName)}`}
        download={fileName}
      >
        Download citation
      </Button>
    )
  }

  return (
    <div className='flex flex-col items-center md:flex-row'>
      <CiteDropdown
        label="Choose a reference manager format:"
        options={options}
        value={selected ?? ''}
        onChange={onFormatChange}
      />
      {renderDownloadBtn()}
    </div>
  )
}
