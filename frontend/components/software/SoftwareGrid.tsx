import ContentInTheMiddle from "../layout/ContentInTheMiddle"
import SoftwareCard from "./SoftwareCard"
import {SoftwareItem} from "../../types/SoftwareItem"

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
    <section className='grid grid-cols-1 gap-[0.125rem] sm:grid-cols-2 lg:grid-cols-3 hd:grid-cols-4 py-4 px=[0.0625]'>
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
    </section>
  )
}
