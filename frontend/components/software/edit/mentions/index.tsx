import {useContext, useState, useEffect} from 'react'

import useSnackbar from '../../../snackbar/useSnackbar'
import {MentionEditType, MentionForSoftware, MentionItem, mentionType} from '../../../../types/MentionType'
import {addMentionToSoftware} from '../../../../utils/editMentions'
import logger from '../../../../utils/logger'
import {getMentionsForSoftwareOfType} from '../../../../utils/editMentions'
import {sortOnDateProp} from '../../../../utils/sortFn'
import ContentLoader from '../../../layout/ContentLoader'
import EditSoftwareSection from '../EditSoftwareSection'
import editSoftwareContext from '../editSoftwareContext'
import {mentionInformation as config} from '../editSoftwareConfig'
import NewMentionModal from './NewMentionModal'
import FindMention from './FindMention'
import EditSectionTitle from '../EditSectionTitle'
import useMentionCountByType from './useMentionCountByType'
import MentionCountContext from './MentionCountContext'
import SoftwareMentionCategories from './SoftwareMentionCategories'
import SoftwareMentionList from './SoftwareMentionList'

type MentionByTypeState = {
  category: MentionEditType,
  items: MentionForSoftware[]
}

export default function EditSoftwareMentions({token}:{token: string}) {
  const {showSuccessMessage, showErrorMessage} = useSnackbar()
  const {pageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [loading, setLoading] = useState(false)
  const [mentions, setMentions] = useState<MentionByTypeState>()
  const {count, loading: loadCount} = useMentionCountByType({software: software?.id ?? '', token})
  const [mentionCount, setMentionCount] = useState(count)
  const [modal, setModal] = useState<{open:boolean,mention?:MentionItem,pos?:number}>({
    open: false
  })

  useEffect(() => {
    if (count) {
      setMentionCount(count)
    }
  },[count])

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
        if (mention?.type) {
          await loadCategory(mention.type as MentionEditType)
          showSuccessMessage(`Added mention to ${mentionType[mention.type]}`)
        } else{
          showSuccessMessage(`Added mention to ${software.brand_name}`)
        }
      } else {
        showErrorMessage(`${resp.message}`)
      }
    }
  }

  async function loadCategory(category: MentionEditType | undefined) {
    // ignore request if category not provided
    if (typeof category == 'undefined') return
    // start request
    setLoading(true)
    const resp = await getMentionsForSoftwareOfType({
      software:software?.id ?? '',
      token,
      type:category,
      frontend:true
    })
    let items:MentionForSoftware[]=[]
    if (resp) {
      // sort on date
      items = resp.sort((a, b) => {
        // sort mentions on date, newest at the top
        return sortOnDateProp(a, b, 'date', 'desc')
      })
    }
    setMentions({
      category,
      items
    })
    if (mentionCount) {
      setMentionCount({
        ...mentionCount,
        [category]: items.length
      })
    }
    setLoading(false)
  }

  if (loadCount) {
    return (
      <ContentLoader />
    )
  }

  return (
    <MentionCountContext.Provider value={{mentionCount,setMentionCount}}>
      <EditSoftwareSection className="py-4 flex-1">
        <section className="grid grid-cols-[1fr,4fr] gap-8">
          <div>
            <EditSectionTitle
              title={config.sectionTitle}
            />
            <SoftwareMentionCategories
              category={mentions?.category ?? 'attachment'}
              onCategoryChange={loadCategory}
            />
          </div>
          <div>
            <EditSectionTitle
              title={config.findMention.title}
              subtitle={config.findMention.subtitle}
            />
            <FindMention
              software={software.id ?? ''}
              token={token}
              onAdd={onAddMention}
            />
            <div className="py-4"></div>
            <div className="flex-1 py-2">
              <EditSectionTitle
                title={mentionType[mentions?.category ?? 'attachment']}
              />
              <div className="py-2"></div>
              {loading ?
                <ContentLoader />
                :
                <SoftwareMentionList
                  category={mentions?.category ?? 'attachment'}
                  items={mentions?.items ?? []}
                  token={token}
                  onDelete={() => loadCategory(mentions?.category)}
                />
              }
            </div>
          </div>
        </section>
      </EditSoftwareSection>
      <NewMentionModal
        open={modal.open}
        pos={modal.pos}
        mention={modal.mention}
        onCancel={closeModal}
        onSubmit={onSubmitMention}
      />
    </MentionCountContext.Provider>
  )
}
