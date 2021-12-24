import {useState, useContext} from 'react'
import Button from '@mui/material/Button'
import CopyIcon from '@mui/icons-material/ContentCopy'
import {copyToClipboard,canCopyToClipboard} from '../../utils/copyToClipboard'
import snackbarContext from '../snackbar/SnackbarContext'

export default function DoiLabel({doi}:{doi:string}) {
  const snackbar = useContext(snackbarContext)
  const canCopy = useState(canCopyToClipboard() && doi)

  async function toClipboard(){
    console.log('Copy DOI...', doi)

    const copied = await copyToClipboard(doi)

    // TODO! connect snackbar
    // snackbar.message='Copied to clipboard!'
    // snackbar.onClose=function onClose(...params:any){
    //   debugger
    //   console.log('snack closed...', params)
    // }
    // snackbar.open = true

    if (copied){
      alert('Copied to clipboard')
    }
  }

  return (
    <div className="py-4 md:pb-8">
      <h3 className="text-sm pb-1">DOI:</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full bg-[#2e3132] p-4">
          {doi}
        </div>
        <Button
          disabled={!canCopy}
          sx={{
            display:'flex',
            justifyContent:'flex-start',
            minWidth:['100%','13rem'],
            ml:[null,2],
            p:2
          }}
          onClick={toClipboard}
        >
          <CopyIcon sx={{mr:1}}/>
          Copy to clipboard
        </Button>
      </div>
    </div>
  )
}
