import {useEffect} from 'react'
import {getImpactForProject} from '~/utils/getProjects'

import {sortOnNumProp} from '~/utils/sortFn'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {MentionItemProps} from '~/types/Mention'

type ImpactForProjectProps = {
  project: string,
  token:string
}

export default function useImpactForProject({project, token}: ImpactForProjectProps) {
  const {mentions, setMentions, loading, setLoading} = useEditMentionReducer()

  useEffect(() => {
    let abort = false
    async function getImpactFromApi() {
      setLoading(true)
      // TODO! this request is made two times, investigate
      const mentionsForProject = await getImpactForProject({
        project,
        token,
        frontend: true
      })
      if (mentionsForProject && abort === false) {
        const mentions:MentionItemProps[] = mentionsForProject.sort((a, b) => {
          // sort mentions on publication year, newest at the top
          return sortOnNumProp(a,b,'publication_year','desc')
        })
        // debugger
        setMentions(mentions)
        setLoading(false)
      }
    }
    if (project && token) {
      getImpactFromApi()
    }
    return () => { abort = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project,token])

  // console.group('useImpactForProject')
  // console.log('loading...', loading)
  // console.log('impactCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    impactCnt: mentions.length,
  }
}
