import {useContext, useState} from 'react'

import useSnackbar from '../../../snackbar/useSnackbar'
import {MentionEditType, MentionItem} from '../../../../types/MentionType'
import {addMentionToSoftware} from '../../../../utils/editMentions'
import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext from '../editSoftwareContext'
import NewMentionModal from './NewMentionModal'
import FindMention from './FindMention'
import SoftwareMentionsByType from './SoftwareMentionsByType'
import EditSectionTitle from '../EditSectionTitle'
import logger from '../../../../utils/logger'

export default function SoftwareMentions({token}:{token: string}) {
  const {showSuccessMessage, showErrorMessage} = useSnackbar()
  const {pageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [category, setCategory] = useState<MentionEditType>('attachment')
  const [modal, setModal] = useState<{open:boolean,mention?:MentionItem,pos?:number}>({
    open: false
  })

  function closeModal() {
    setModal({open:false})
  }

  function onSubmitMention({data,pos}:{data:MentionItem,pos?:number}) {
    logger('mentions.onSubmitMention...NOT IMPLEMENTED','warn')
  }

  async function onAddMention(mention:MentionItem) {
    if (software && software?.id) {
      const resp = await addMentionToSoftware({
        mention: mention.id,
        software: software.id,
        token
      })
      if (resp.status === 200) {
        setCategory(mention.type as MentionEditType ?? 'attachment')
        showSuccessMessage(`Added mention to category: ${mention.type}`)
      } else {
        showErrorMessage(`Failed to add mention to ${software?.brand_name}`)
      }
    }
  }

  return (
    <>
      <EditSoftwareSection className="py-4 flex-1">
        <EditSectionTitle
          title="Mentions"
        />
        <FindMention
          software={software.id ?? ''}
          token={token}
          onAdd={onAddMention}
        />

        <SoftwareMentionsByType
          software={software.id}
          token={token}
          showCategory={category}
        />

      </EditSoftwareSection>
      <NewMentionModal
        open={modal.open}
        pos={modal.pos}
        mention={modal.mention}
        onCancel={closeModal}
        onSubmit={onSubmitMention}
      />
    </>
  )
}
