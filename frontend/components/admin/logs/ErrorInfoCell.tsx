// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import KeyIcon from '@mui/icons-material/Key'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import DataObjectIcon from '@mui/icons-material/DataObject'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import copyToClipboard from '~/utils/copyToClipboard'

type LogMessageCellProps={
  message: string
  other_data: string
  stack_trace: string
  id: string
  slug: string | null
}

export default function ErrorInfoCell({message,stack_trace,other_data,id,slug}:LogMessageCellProps) {
  const [action, setAction] = useState<string>()

  function toggleButton(value:string){
    if (action===value){
      setAction(undefined)
    } else {
      setAction(value)
    }
  }

  return (
    <>
      <div className="pb-2">{message}</div>
      <div className="flex items-center gap-4 font-bold">
        {/* Other data  */}
        <Tooltip
          title={
            <>
              <div className="flex justify-between text-base">
                Error data
                <IconButton
                  size="small"
                  onClick={()=>{
                    copyToClipboard(JSON.stringify(other_data,null,2))
                    toggleButton('other_data')
                  }}>
                  <ContentCopyIcon sx={{color:'primary.contrastText'}} />
                </IconButton>
              </div>
              <pre style={{overflow:'auto', paddingBottom:'0.5rem'}}>
                {JSON.stringify(other_data,null,2)}
              </pre>
            </>
          }
          open={action === 'other_data'}
          // onClose={()=>toggleButton('other_data')}
          arrow
        >
          <IconButton
            onClick={()=>toggleButton('other_data')}>
            <DataObjectIcon />
          </IconButton>
        </Tooltip>

        {/* Stack trace */}
        <Tooltip
          title={
            <>
              <div className="flex justify-between text-base">
                Stack trace
                <IconButton
                  size="small"
                  onClick={()=>{
                    copyToClipboard(stack_trace)
                    toggleButton('stack_trace')
                  }}>
                  <ContentCopyIcon sx={{color:'primary.contrastText'}} />
                </IconButton>
              </div>
              <pre style={{overflow:'auto', paddingBottom:'0.5rem'}}>
                {stack_trace}
              </pre>
            </>
          }
          open={action === 'stack_trace'}
          arrow
        >
          <IconButton
            onClick={()=>toggleButton('stack_trace')}>
            <ErrorOutlineIcon />
          </IconButton>
        </Tooltip>

        {/* Log id  */}
        <Tooltip
          title={
            <>
              <div className="flex justify-between items-center text-base">
                Log id
                <IconButton
                  size="small"
                  onClick={()=>{
                    copyToClipboard(id)
                    toggleButton('log_id')
                  }}>
                  <ContentCopyIcon sx={{color:'primary.contrastText'}} />
                </IconButton>
              </div>
              <pre style={{overflow:'auto', paddingBottom:'0.5rem'}}>
                {id}
              </pre>
            </>
          }
          open={action === 'log_id'}
          arrow
        >
          <IconButton
            onClick={()=>toggleButton('log_id')}>
            <KeyIcon />
          </IconButton>
        </Tooltip>
        {slug ?
          <IconButton
            title="Go to offending page"
            href={slug}
            target='_blank'
          >
            <OpenInNewIcon />
          </IconButton>
          : null
        }
      </div>
    </>
  )
}
