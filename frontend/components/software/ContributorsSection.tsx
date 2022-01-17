import {Contributor} from '../../types/Contributor'
import PageContainer from '../layout/PageContainer'
import ContributorsList from './ContributorsList'
import ContactPersonCard from './ContactPersonCard'

function clasifyContributors(contributors: Contributor[]) {
  const contributorList:Contributor[] = []
  let contact:Contributor|null=null

  contributors.forEach(item => {
    // construct file name
    if (item.avatar_mime_type) {
      // preferably
      // construct image path using id and mime type, example: 2023dbe4-f49c-4af9-b37e-13eacf5809a1.png
      // item.avatar_url = `/image/contributor/${item.id}.${item.avatar_mime_type.split('/')[1]}`
      // currently we use posgrest + nginx approach
      // image/rpc/get_contributor_image?id=15c8d47f-f8f0-45ff-861c-1e57640ebd56
      item.avatar_url = `/image/rpc/get_contributor_image?id=${item.id}`
    } else {
      item.avatar_url=null
    }
    if (item.is_contact_person === true) {
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
            <ContributorsList contributors={contributors} />
          </div>
        </section>
      </PageContainer>
    </section>
  )
}
