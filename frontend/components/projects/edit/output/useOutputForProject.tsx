import {useEffect} from 'react'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {MentionItemProps} from '~/types/Mention'
import {getOutputForProject} from '~/utils/getProjects'
import {sortOnNumProp} from '~/utils/sortFn'

type OutputForProjectProps = {
  project: string,
  token:string
}

export default function useOutputForProject({project, token}: OutputForProjectProps) {
  const {setLoading, setMentions, loading, mentions} = useEditMentionReducer()

  useEffect(() => {
    let abort = false
    async function getImpact() {
      setLoading(true)
      const mentions = await getOutputForProject({
        project,
        token,
        frontend: true
      })
      const output:MentionItemProps[] = mentions.sort((a, b) => {
        // sort mentions on publication year, newest at the top
        return sortOnNumProp(a,b,'publication_year','desc')
      })
      // debugger
      if (mentions && abort === false) {
        setMentions(output)
        setLoading(false)
      }
    }
    if (project && token) {
      getImpact()
    }
    () => { abort = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project,token])

  // console.group('useOutputForProject')
  // console.log('loading...', loading)
  // console.log('outputCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    outputCnt: mentions.length,
  }
}
