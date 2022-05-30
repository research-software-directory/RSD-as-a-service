import {Session} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditImpactProvider from './EditImpactProvider'
import ImpactByType from './ImpactByType'
import FindImpact from './FindImpact'
import AddImpact from './AddImpact'
import useProjectContext from '../useProjectContext'

export default function ProjectImpact({session}:{session:Session}) {
  const {project} = useProjectContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditImpactProvider token={session.token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <ImpactByType session={session}/>
        </div>
        <div className="py-4">
          <FindImpact />
          <div className="py-4"></div>
          <AddImpact />
        </div>
      </EditSection>
    </EditImpactProvider>
  )
}
