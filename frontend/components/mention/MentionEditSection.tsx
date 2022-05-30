import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import MentionEditList from './MentionEditList'
import {mentionsByType} from '~/utils/editMentions'
import EditMentionModal from './EditMentionModal'
import {getMentionTypeOrder, mentionType} from './config'
import ConfirmDeleteModal from '../layout/ConfirmDeleteModal'
import ContentLoader from '../layout/ContentLoader'
import useEditMentionReducer from './useEditMentionReducer'

type ModalState = {
  open: boolean,
  item?: MentionItemProps
}

export default function MentionEditSection() {
  const {
    settings, mentions, loading, editModal, setEditModal,
    confirmModal, confirmDelete, onSubmit, onDelete
  } = useEditMentionReducer()

  // do not render if loading
  if (loading) return <ContentLoader />

  function closeEditModal() {
    // we close modal by calling confirmDelete
    // without item
    setEditModal()
  }

  function renderMentionList() {
    // if no items show no items component (message)
    if (!mentions || mentions.length === 0) return settings.noItemsComponent() ?? null
    // classify mention on state update
    const mentionByType = mentionsByType(mentions)
    // if no items show no items component (message)
    if (typeof mentionByType == 'undefined') return settings.noItemsComponent() ?? null
    // sort keys to keep same order during editing
    const mentionTypes = getMentionTypeOrder(mentionByType)
    // render edit list by type
    return mentionTypes.map((key) => {
      const mType = key as MentionTypeKeys
      const items = mentionByType[mType]
      const title = mentionType[mType].plural
      // debugger
      return (
        <MentionEditList
          key={key}
          title={title}
          type={mType}
          items={items ?? []}
        />
        )
      })
  }

  return (
    <>
      {renderMentionList()}
      {/* modal as external part of the section */}
      <EditMentionModal
        title={settings.editModalTitle}
        open={editModal.open}
        pos={editModal.pos}
        item={editModal.item}
        onCancel={closeEditModal}
        onSubmit={(props)=>onSubmit(props.data)}
      />
      <ConfirmDeleteModal
        open={confirmModal.open}
        title={settings.cofirmDeleteModalTitle}
        body={
          <p>Are you sure you want to remove <strong>{confirmModal?.item?.title ?? 'this item'}</strong>?</p>
        }
        onCancel={() => {
          // cancel confirm by removing item
          confirmDelete()
        }}
        onDelete={() => {
          if (confirmModal?.item) onDelete(confirmModal?.item)
          // hide modal by removing confirm item
          confirmDelete()
        }}
      />
    </>
  )
}
