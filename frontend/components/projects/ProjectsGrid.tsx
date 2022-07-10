// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FlexibleGridSection, {FlexGridProps} from '../layout/FlexibleGridSection'
import NoContent from '../layout/NoContent'
import ProjectCard, {ProjectCardProps} from './ProjectCard'

type ProjectGridProps = FlexGridProps & {
  className?:string
  projects: ProjectCardProps[]
}

// render software cards
export default function ProjectsGrid({projects,className='gap-[0.125rem] p-[0.125rem] py-[2rem]',...props}:ProjectGridProps){
  if (typeof projects == 'undefined' || projects.length===0){
    return <NoContent />
  }

  return (
    <FlexibleGridSection
      className={className}
      {...props}
    >
      {projects.map(item=>{
        return(
          <ProjectCard
            key={item.slug}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
