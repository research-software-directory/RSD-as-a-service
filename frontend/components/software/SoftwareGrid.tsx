import ContentInTheMiddle from '../layout/ContentInTheMiddle'
import SoftwareCard from './SoftwareCard'
import FlexibleGridSection, {FlexGridProps} from '../layout/FlexibleGridSection'

export type SoftwareGridType = {
  slug: string,
  brand_name: string,
  short_statement?: string,
  is_featured?: boolean,
  updated_at?: string | null,
  is_published?: boolean
}

// render software cards
export default function SoftwareGrid({software,grid,className='gap-[0.125rem] pt-4 pb-12'}:
  {software: SoftwareGridType[], grid: FlexGridProps, className?:string }) {
  // console.log("renderItems...software...", software)

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
      {...grid}
    >
      {software.map(item=>{
        return(
          <SoftwareCard
            key={`/software/${item.slug}/`}
            href={`/software/${item.slug}/`}
            brand_name={item.brand_name}
            short_statement={item.short_statement ?? ''}
            is_featured={item.is_featured ?? false}
            updated_at={item.updated_at ?? null}
          />
        )
      })}
    </FlexibleGridSection>
  )
}
