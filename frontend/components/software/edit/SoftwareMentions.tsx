import {useContext, useState} from 'react'

import useSnackbar from '../../snackbar/useSnackbar'
import {MentionItem} from '../../../types/MentionType'
import ConfirmDeleteModal from '../../layout/ConfirmDeleteModal'

import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'
import EditMentionModal from './EditMentionModal'
import {mentionInformation as config} from './editSoftwareConfig'
import {ModalProps,ModalStates} from './editSoftwareTypes'

type EditMentionModalProps = ModalProps & {
  mention?: MentionItem
}

export default function SoftwareMentions({token}: {token: string}) {
  const {showInfoMessage} = useSnackbar()
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [modal, setModal] = useState<ModalStates<EditMentionModalProps>>({
    edit: {
      open: false
    },
    delete: {
      open: false
    }
  })

  // console.group('SoftwareContributors')
  // console.log('loading...', loading)
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('contributors...', contributors)
  // console.groupEnd()

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

  return (
    <section className="flex-1">
      <EditSoftwareSection>
        <div className="py-4">
          <EditSectionTitle
            title="Mentions"
          >
          </EditSectionTitle>

          <button onClick={() => {
            showInfoMessage('This is info message')
          }}>Info snack</button>
        </div>
      </EditSoftwareSection>
      <EditMentionModal
        open={modal.edit.open}
        pos={modal.edit.pos}
        mention={modal.edit.mention}
        onCancel={closeModals}
        onSubmit={onSubmitMention}
      />
      <ConfirmDeleteModal
        title="Remove testimonial"
        open={modal.delete.open}
        displayName={modal.delete.displayName ?? ''}
        onCancel={closeModals}
        onDelete={()=>deleteMention(modal.delete.pos)}
      />
    </section>
  )
}
