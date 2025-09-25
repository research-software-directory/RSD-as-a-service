// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionByType, MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import MentionEditList from './MentionEditList'
import {classifyMentionsByType} from '~/components/mention/apiEditMentions'
import EditMentionModal from './EditMentionModal'
import {getMentionTypeOrder, mentionType} from './config'
import ConfirmDeleteModal from '../layout/ConfirmDeleteModal'
import ContentLoader from '../layout/ContentLoader'
import useEditMentionReducer from './useEditMentionReducer'
import MentionEditFeatured from './MentionEditFeatured'
import {sortOnNumProp} from '~/utils/sortFn'
import SanitizedMathMLBox from '../layout/SanitizedMathMLBox'

export default function MentionEditSection() {
  const {
    settings, mentions, loading, editModal, setEditModal,
    confirmModal, confirmDelete, onSubmit, onDelete
  } = useEditMentionReducer()

  // console.group('MentionEditSection')
  // console.log('settings...', settings)
  // console.log('mentions...', mentions)
  // console.log('loading...', loading)
  // console.groupEnd()

  // do not render if loading
  if (loading) return <ContentLoader />

  function closeEditModal() {
    // we close modal by calling confirmDelete
    // without item
    setEditModal()
  }

  function renderHighlights(highlightedMentions:MentionItemProps[]) {
    if (highlightedMentions.length === 0) return null
    return (
      <>
        <h3 className="pb-4 text-xl">{mentionType['highlight'].plural}</h3>
        {
          highlightedMentions
            .sort((a, b) => sortOnNumProp(a, b, 'publication_year', 'desc'))
            .map((item) => {
              return (
                <MentionEditFeatured
                  key={item.id}
                  item={item}
                />
              )
            })
        }
      </>
    )
  }

  function renderMentionList(mentionByType:MentionByType) {
    // if no items show no items component (message)
    if (typeof mentionByType == 'undefined') return null
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
          items={items ?? []}
        />
      )
    })
  }

  function renderModals() {
    return (
      <>
        {/* modal as external part of the section */}
        {editModal.open ?
          <EditMentionModal
            title={settings.editModalTitle}
            open={editModal.open}
            pos={editModal.pos}
            item={editModal.item}
            onCancel={closeEditModal}
            onSubmit={(props)=>onSubmit(props.data)}
          />
          : null
        }{
          confirmModal.open ?
            <ConfirmDeleteModal
              open={confirmModal.open}
              title={settings.confirmDeleteModalTitle}
              body={
                <p>Are you sure you want to remove <strong>
                  <SanitizedMathMLBox
                    component="span"
                    rawHtml={confirmModal?.item?.title ?? 'this item'}
                  />
                </strong>?</p>
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
            : null
        }
      </>
    )
  }

  // if no items show no items component (message) AND modals
  if (!mentions || mentions.length === 0) {
    return (
      <>
        {settings.noItemsComponent() ?? null}
        {renderModals()}
      </>
    )
  }
  // extract mention items by types
  const {mentionByType,featuredMentions} = classifyMentionsByType(mentions)

  return (
    <>
      {renderHighlights(featuredMentions)}
      {renderMentionList(mentionByType)}
      {renderModals()}
    </>
  )
}
