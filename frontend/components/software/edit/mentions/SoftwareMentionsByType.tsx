import {useState,useEffect} from 'react'

import {sortOnDateProp} from '../../../../utils/sortFn'
import {getMentionsForSoftwareOfType} from '../../../../utils/editMentions'
import {mentionType,MentionForSoftware,MentionEditType} from '../../../../types/MentionType'
import ContentLoader from '../../../layout/ContentLoader'
import SoftwareMentionCategories from './SoftwareMentionCategories'
import EditSectionTitle from '../EditSectionTitle'
import SoftwareMentionList from './SoftwareMentionList'
import MentionCountContext from './MentionCountContext'
import useMentionCountByType from './useMentionCountByType'

type SoftwareMentionByTypeProps = {
  software: string | undefined
  token: string
  showCategory: MentionEditType | undefined
}

type MentionByTypeState = {
  category: MentionEditType,
  items: MentionForSoftware[]
}

export default function SoftwareMentionsByType({software,token,showCategory}:
  SoftwareMentionByTypeProps) {
  const [loadCategory, setLoadCategory] = useState<MentionEditType>()
  const [loading, setLoading] = useState(false)
  const {count, loading:loadCount} = useMentionCountByType({software:software ?? '',token})
  const [mentionCount, setMentionCount] = useState(count)
  const [state, setState] = useState<MentionByTypeState>()

  useEffect(() => {
    if (showCategory) {
      setLoadCategory(showCategory)
    }
  }, [showCategory])

  useEffect(() => {
    if (count) {
      setMentionCount(count)
    }
  },[count,loadCount])

  useEffect(() => {
    let abort = false
    async function getItems(software: string, token: string, category: MentionEditType) {
      setLoading(true)
      const resp = await getMentionsForSoftwareOfType({
        software,
        token,
        type:category,
        frontend:true
      })
      // stop on abort
      if (abort===true) return
      // setMentions(resp ?? [])
      let items:MentionForSoftware[]=[]
      if (resp) {
        // sort on date
        items = resp.sort((a, b) => {
          // sort mentions on date, newest at the top
          return sortOnDateProp(a, b, 'date', 'desc')
        })
      }
      setState({
        category,
        items
      })
      if (mentionCount) {
        setMentionCount({
          ...mentionCount,
          [category]: resp?.length ?? 0
        })
      }
      setLoading(false)
    }
    // if all params provided and category differs from state.category
    // NOTE! state holds last category loaded from api and loadCategory is the newone
    if (typeof software != 'undefined' &&
      loadCategory && loadCategory !== state?.category && token) {
      getItems(software,token,loadCategory)
    }
    return ()=>{abort=true}
  },[loadCategory,state,software,token,mentionCount])

  // console.group('SoftwareMentionsByType')
  // console.log('showCategory...', showCategory)
  // console.log('loadCategory...', loadCategory)
  // console.log('software...', software)
  // console.log('loading...', loading)
  // console.log('state...', state)
  // console.groupEnd()

  function removeFromState(pos: number) {
    if (state?.items) {
      const newList = [
        ...state?.items.slice(0, pos),
        ...state?.items.slice(pos + 1)
      ]
      setState({
        ...state,
        items: newList
      })
      if (mentionCount) {
        setMentionCount({
          ...mentionCount,
          [state.category]: newList.length
        })
      }
    }
  }

  if (loadCount === true) {
    return (
      <section className="py-8">
        <ContentLoader />
      </section>
    )
  }

  return (
    <section className="py-8 grid grid-cols-[1fr,4fr] gap-8">
      <MentionCountContext.Provider value={{mentionCount,setMentionCount}}>
        <SoftwareMentionCategories
          category={state?.category ?? 'attachment'}
          onCategoryChange={(category) => setLoadCategory(category)}
        />
        <div className="flex-1 py-2">
          <EditSectionTitle
            title={mentionType[state?.category ?? 'attachment']}
          />
          <div className="py-2"></div>
          {loading ?
            <ContentLoader />
            :
            <SoftwareMentionList
              category={state?.category ?? 'attachment'}
              items={state?.items ?? []}
              token={token}
              onDelete={removeFromState}
            />
          }
        </div>
      </MentionCountContext.Provider>
    </section>
  )
}
