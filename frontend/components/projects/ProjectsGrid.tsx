import ContentInTheMiddle from '../layout/ContentInTheMiddle'
import FlexibleGridSection from '../layout/FlexibleGridSection'
import ProjectCard, {ProjectCardProps} from './ProjectCard'

type ProjectGridProps = {
  minHeight?:string
  maxHeight?:string
  minWidth?:string
  maxWidth?:string
  className?:string
  projects: ProjectCardProps[]
}

// render software cards
export default function ProjectsGrid({projects,className='gap-[0.125rem] py-[2rem]',...props}:ProjectGridProps){
  if (projects.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
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
