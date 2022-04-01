import ContentInTheMiddle from '../../layout/ContentInTheMiddle'
import FlexibleGridSection from '../../layout/FlexibleGridSection'
import SoftwareCard from '../../../components/software/SoftwareCard'
import {SoftwareOfOrganisation} from '../../../types/Organisation'

type SoftwareGridProps = {
  minHeight?:string
  maxHeight?:string
  minWidth?:string
  maxWidth?:string
  className?:string
  software: SoftwareOfOrganisation[]
}

// render software cards
export default function SoftwareGrid({software,className='gap-[0.125rem] py-[2rem]',...props}:SoftwareGridProps){
  if (software.length===0){
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
      {software.map(item=>{
        return(
          <SoftwareCard
            href={`/software/${item.slug}/`}
            key={item.slug}
            {...item}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
