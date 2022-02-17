import {Contributor} from '../../types/Contributor'
import PageContainer from '../layout/PageContainer'
import ContributorsList from './ContributorsList'
import ContactPersonCard from './ContactPersonCard'
import {getAvatarUrl} from '../../utils/editContributors'

function clasifyContributors(contributors: Contributor[]) {
  const contributorList:Contributor[] = []
  let contact: Contributor | null = null


  contributors.forEach(item => {
    // construct file name
    item.avatar_url = getAvatarUrl(item)
    // take first contact person to be show as contact
    if (item.is_contact_person === true && contact===null) {
      contact = item
    } else {
      contributorList.push(item)
    }
  })
  return {
    contributorList,
    contact
  }
}

export default function ContributorsSection({contributors}: { contributors: Contributor[] }) {
  // do not show section if no content
  if (contributors.length===0) return null
  // clasify
  const {contact, contributorList} = clasifyContributors(contributors)
  return (
    <section className="bg-grey-200">
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="software-contributors-section-title"
          className="pb-8 text-[2rem] text-primary">
          Contributors
        </h2>
        <section className="2xl:flex 2xl:flex-row-reverse">
          <div className="2xl:flex-1 lg:self-start">
            <ContactPersonCard person={contact} />
          </div>
          <div className="2xl:flex-[3]">
            <ContributorsList contributors={contributorList} />
          </div>
        </section>
      </PageContainer>
    </section>
  )
}
