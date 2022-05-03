import {useEffect,useState} from 'react'

import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useProjectContext from '../useProjectContext'
import useProjectMaintainers, {MaintainerOfProject} from './useProjectMaintainer'
import ProjectMaintainersList from './ProjectMaintainersList'
import FindMaintainer from './FindMaintainer'
import MaintainerInviteLink from './MaintainerInviteLink'


export default function ProjectMaintainers({slug, session}: {slug: string, session: Session }) {
  const {loading:loadProject, setLoading, project} = useProjectContext()
  const {loading:loadMaintainers,maintainers} = useProjectMaintainers({
    slug,token:session.token
  })
  const [projectMaintainers, setProjectMaintaners] = useState<MaintainerOfProject[]>([])

  console.group('ProjectMaintainers')
  console.log('loadProject...', loadProject)
  console.log('loadMaintainers...', loadMaintainers)
  console.log('maintainers...', maintainers)
  console.log('projectMaintainers...', projectMaintainers)
  console.groupEnd()

  useEffect(() => {
    let abort = false
    if (loadMaintainers === false) {
      setProjectMaintaners(maintainers)
      setLoading(false)
    }
    return ()=>{abort=true}
  },[maintainers,loadMaintainers])

  if (loadProject || loadMaintainers) {
    return (
      <ContentLoader />
    )
  }

  function addMaintainer(maintainer: MaintainerOfProject) {
    console.log('add maintainer...', maintainer)
  }

  return (
    <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
      <div className="py-4 xl:pl-[3rem]">
        <EditSectionTitle
          title="Maintainers"
        />
        <ProjectMaintainersList
          maintainers={projectMaintainers}
        />
      </div>
      <div className="py-4 min-w-[21rem] xl:my-0">
        <EditSectionTitle
          title="Find maintainer"
        />
        <div className="py-2"></div>
        <FindMaintainer onAdd={addMaintainer}/>
        <div className="py-4"></div>
        <MaintainerInviteLink
          project={project.id}
          account={session.user?.account ?? ''}
          token={session.token}
        />
      </div>
    </EditSection>
  )
}
