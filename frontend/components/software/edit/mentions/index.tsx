import {useContext, useEffect, useState} from 'react'

import useSnackbar from '../../../snackbar/useSnackbar'
import {MentionForSoftware, MentionItem} from '../../../../types/MentionType'
import ConfirmDeleteModal from '../../../layout/ConfirmDeleteModal'

import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext from '../editSoftwareContext'
import EditSectionTitle from '../EditSectionTitle'
import EditMentionModal from './EditMentionModal'
import {mentionInformation as config} from '../editSoftwareConfig'
import {ModalProps,ModalStates} from '../editSoftwareTypes'
import FindMention from './FindMention'

import SoftwareMentionsByType from './SoftwareMentionsByType'
import {addMentionToSoftware, clasifyMentionsByType, removeMentionForSoftware} from '../../../../utils/editMentions'
import SoftwareMentionCategories from './SoftwareMentionCategories'

type EditMentionModalProps = ModalProps & {
  mention?: MentionItem
}

export default function SoftwareMentions({token}:{token: string}) {
  const {showSuccessMessage, showErrorMessage} = useSnackbar()
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [mentionCount, setMentionCount] = useState(0)
  const [modal, setModal] = useState<ModalStates<EditMentionModalProps>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })


  console.group('SoftwareMentions')
  console.log('token...', token)
  console.log('software...', software)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('mensionsForSoftware...', mentionsForSoftware)
  // console.log('mentionByType...', mentionByType)
  console.groupEnd()


  function closeModals() {
    setModal({
      edit: {
        open:false
      },
      delete: {
        open:false
      }
    })
  }

  function onSubmitMention({data,pos}:{data:MentionItem,pos?:number}) {
    console.log('Submit mention...', data)
  }

  function deleteMention(pos: number | undefined) {
    if (typeof pos == 'undefined') return
  }

  function getMentionSubtitle() {
    if (mentionCount === 1) {
      return `${software?.brand_name} has 1 mention`
    }
    return `${software?.brand_name} has ${mentionCount} mentions`
  }

  async function onAddMention(mention:MentionItem) {
    if (software && software?.id) {
      const resp = await addMentionToSoftware({
        mention: mention.id,
        software: software.id,
        token
      })
      if (resp.status === 200) {
        showSuccessMessage(`Added mention to category: ${mention.type}`)
      } else {
        showErrorMessage(`Failed to add mention to ${software?.brand_name}`)
      }
    }
  }

  return (
    <>
      <EditSoftwareSection className="flex-1">
        <FindMention
          software={software.id ?? ''}
          token={token}
          onAdd={onAddMention}
        />
        <SoftwareMentionsByType
          software={software.id}
          token={token}
          onCountChange={(count) => setMentionCount(count)}
        />
      </EditSoftwareSection>
      <EditMentionModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        mention={modal.edit.mention}
        onCancel={closeModals}
        onSubmit={onSubmitMention}
      />
      <ConfirmDeleteModal
        title="Remove mention"
        open={modal.delete.open}
        displayName={modal.delete.displayName ?? ''}
        onCancel={closeModals}
        onDelete={()=>deleteMention(modal.delete.pos)}
      />
    </>
  )
}
