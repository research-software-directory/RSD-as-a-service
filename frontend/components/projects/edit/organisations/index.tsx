import {useEffect} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useProjectContext from '../useProjectContext'

export default function ProjectOrganisations() {
  const {loading, setLoading} = useProjectContext()

  useEffect(() => {
    let abort = false
    setTimeout(() => {
      if (abort) return
      if (loading) setLoading(false)
    }, 1000)
    return ()=>{abort=true}
  },[loading,setLoading])

  if (loading) {
    return (
      <ContentLoader />
    )
  }

  return (
    <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
      <div className="py-4 xl:pl-[3rem]">
        <EditSectionTitle
          title="Organisations"
        />
      </div>
      <div className="py-4 min-w-[21rem] xl:my-0">
        <EditSectionTitle
          title="Find organisation"
        />
      </div>
    </EditSection>
  )
}
