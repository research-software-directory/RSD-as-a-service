import {useContext} from 'react'
import Button from '@mui/material/Button'
import CopyIcon from '@mui/icons-material/ContentCopy'
import snackbarContext from '../snackbar/SnackbarContext'

export default function DoiLabel({concept_doi}:{concept_doi:string}) {
  const snackbar = useContext(snackbarContext)

  function copyToClipboard(){
    console.log('Copy DOI...', concept_doi)

    // TODO! connect snackbar
    // snackbar.message='Copied to clipboard!'
    // snackbar.onClose=function onClose(...params:any){
    //   debugger
    //   console.log('snack closed...', params)
    // }
    // snackbar.open = true
    alert('Copied to clipboard')
  }

  return (
    <div className="py-4 md:pb-8">
      <h3 className="text-sm pb-1">DOI:</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full bg-[#2e3132] p-4">
          {concept_doi}
        </div>
        <Button
          sx={{
            display:'flex',
            justifyContent:'flex-start',
            minWidth:['100%','13rem'],
            ml:[null,2],
            p:2
          }}
          onClick={copyToClipboard}
        >
          <CopyIcon sx={{mr:1}}/>
          Copy to clipboard
        </Button>
      </div>
    </div>
  )
}
