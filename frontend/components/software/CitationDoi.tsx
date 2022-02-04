import {useState, useContext} from 'react'
import Button from '@mui/material/Button'
import CopyIcon from '@mui/icons-material/ContentCopy'
import {copyToClipboard,canCopyToClipboard} from '../../utils/copyToClipboard'
import snackbarContext from '../snackbar/PageSnackbarContext'

export default function CitationDoi({doi}:{doi:string}) {
  const {setSnackbar} = useContext(snackbarContext)
  const canCopy = useState(canCopyToClipboard() && doi)

  async function toClipboard(){
    // copy doi to clipboard
    const copied = await copyToClipboard(doi)
    // notify user about copy action
    if (copied){
      setSnackbar({
        open:true,
        severity:'info',
        message:'Copied to clipboard',
        duration: 3000,
        anchor: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
    } else {
      setSnackbar({
        open:true,
        severity:'error',
        message:`Failed to copy doi ${doi} `,
        anchor: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
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
