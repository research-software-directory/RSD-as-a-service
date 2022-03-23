import {OrganisationForOverview} from '../../types/Organisation'
import ContentInTheMiddle from '../layout/ContentInTheMiddle'
import OrganisationCard from './OrganisationCard'

// render software cards
export default function OrganisationsGrid({organisations}:{organisations:OrganisationForOverview[]}){
  // console.log("renderItems...software...", software)

  if (organisations.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }

  return (
    <section className='grid grid-cols-1 gap-[0.125rem] sm:grid-cols-2 lg:grid-cols-3 hd:grid-cols-4 py-4 px-[0.0625rem]'>
      {organisations.map(item=>{
        return(
          <OrganisationCard
            key={item.id}
            {...item}
          />
        )
      })}
    </section>
  )
}
