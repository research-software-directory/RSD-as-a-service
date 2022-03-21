
import {ParticipatingOrganisationProps} from '../../types/Organisation'
import PageContainer from '../layout/PageContainer'
import ParticipatingOrganisation from './ParticipatingOrganisation'

export default function OrganisationsSection({organisations = []}: { organisations: ParticipatingOrganisationProps[] }) {
  // do not render section if no data
  if (organisations?.length === 0) return null

  return (
    <section>
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="software-contributors-section-title"
          className="pb-8 text-[2rem] text-primary leading-10">
          Participating organisations
        </h2>
        <section className="grid gap-8 auto-rows-[minmax(3rem,5rem)] md:grid-cols-4 xl:grid-cols-5">
          {organisations.map((item, pos) => {
            return (
              <ParticipatingOrganisation
                key={pos}
                {...item}
              />
            )
          })}
        </section>
      </PageContainer>
    </section>
  )
}
