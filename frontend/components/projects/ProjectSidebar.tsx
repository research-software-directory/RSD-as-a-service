import {Project, ProjectLink} from '../../types/Project'

import ProjectStatus from './ProjectStatus'
import ProjectFunding from './ProjectFunding'
import ProjectLinks from './ProjectLinks'
import ProjectTags from './ProjectTags'


type ProjectSidebarProps = {
  date_start: string
  date_end: string
  grant_id: string | null
  topics: string[]
  technologies: string[]
  links: ProjectLink[]
}


export default function ProjectSidebar({date_start,date_end,grant_id,links,topics,technologies}:ProjectSidebarProps) {

  // if (typeof project == 'undefined') return null
  // const {date_start,date_end, grant_id} = project

  return (
    <aside className="bg-grey-200 p-6">

      <ProjectStatus
        date_start={date_start}
        date_end={date_end}
      />

      <ProjectFunding
        grant_id={grant_id}
      />

      <ProjectLinks
        links={links}
      />

      <ProjectTags
        title="Topics"
        tags={topics}

      />

      <ProjectTags
        title="Technologies"
        tags={technologies}
      />

    </aside>
  )
}
