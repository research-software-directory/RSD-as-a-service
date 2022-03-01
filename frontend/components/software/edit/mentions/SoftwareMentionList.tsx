import {useState, useContext} from 'react'
import {Alert, AlertTitle} from '@mui/material'

import {MentionEditType, MentionForSoftware} from '../../../../types/MentionType'
import {removeMentionForSoftware} from '../../../../utils/editMentions'
import useSnackbar from '../../../snackbar/useSnackbar'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'
import editSoftwareContext from '../editSoftwareContext'
import SoftwareMentionItem from './SoftwareMentionItem'

export default function SoftwareMentionList({category,items,token, onDelete}:
  {category:MentionEditType, items: MentionForSoftware[], token: string, onDelete:(pos:number)=>void}) {
  const {showSuccessMessage, showErrorMessage} = useSnackbar()
  const {pageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [modal, setModal] = useState<{open:boolean,pos?:number,displayName?:string}>({
    open: false
  })

  async function removeMention(pos: number|undefined) {
    if (typeof pos == 'undefined') return
    const mention = items[pos]
    // close modal first
    setModal({open: false})
    if (mention?.id && software?.id) {
      // remove from data
      const resp = await removeMentionForSoftware({
        mention: mention?.id,
        software:software?.id,
        token
      })
      if (resp.status === 200) {
        // remove from local state too
        onDelete(pos)
        showSuccessMessage(`Removed mention from ${software?.brand_name}`)
      } else {
        showErrorMessage(`Failed to remove mention from ${software?.brand_name}`)
      }
    } else {
      showErrorMessage(`Failed to remove mention from ${software?.brand_name}`)
    }
  }

  if (items.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No mentions in this category</AlertTitle>
        Add one using <strong>search for mentions</strong> at the top of the screen.
      </Alert>
    )
  }

  function deleteMention(pos: number | undefined) {
    if (typeof pos == 'undefined') return
    const mention = items[pos]
    if (mention && mention?.id) {
      setModal({
        open: true,
        displayName: mention.title,
        pos
      })
    }
  }

  return (
    <>
      {items.map((item, pos) => {
        return (
          <div key={pos} className="p-4 hover:bg-grey-200 hover:text-black">
            <SoftwareMentionItem
              pos={pos}
              item={item}
              onDelete={()=>deleteMention(pos)}
            />
          </div>
        )
      })}
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove mention"
        body={
          <p>
            Are you sure you want to remove <strong>{modal.displayName ?? ''}</strong> from <strong>{software.brand_name}</strong>?
          </p>
        }
        onCancel={()=>setModal({open:false})}
        onDelete={()=>removeMention(modal.pos)}
      />
    </>
  )
}
