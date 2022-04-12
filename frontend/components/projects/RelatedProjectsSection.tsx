import {RelatedProject} from '../../types/Project'
import PageContainer from '../layout/PageContainer'

import ProjectsGrid from './ProjectsGrid'

export default function RelatedProjectsSection({relatedProjects}:
  {relatedProjects: RelatedProject[]}) {
  // do not show section if no data
  if (typeof relatedProjects == 'undefined' || relatedProjects.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary">
        Related projects
      </h2>
      <ProjectsGrid
        className='gap-[0.125rem]'
        minWidth='26rem'
        maxWidth='1fr'
        height='17rem'
        projects={relatedProjects}
      />
    </PageContainer>
  )
}
