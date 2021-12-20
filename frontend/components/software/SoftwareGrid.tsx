import ContentInTheMiddle from "../layout/ContentInTheMiddle"
import CardGrid from '../layout/CardGrid'
import SoftwareCard from './SoftwareCard'
import {SoftwareItem} from '../../types/SoftwareItem'

// render software cards
export default function SoftwareGrid({software}:{software:SoftwareItem[]}){
  // console.log("renderItems...software...", software)

  if (software.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }

  return (
    <CardGrid>
    {software.map(item=>{
      return(
        <SoftwareCard
          key={`/software/${item.slug}/`}
          href={`/software/${item.slug}/`}
          brand_name={item.brand_name}
          short_statement={item.short_statement}
          is_featured={item.is_featured}
          updated_at={item.updated_at}
        />
      )
    })}
    </CardGrid>
  )
}
