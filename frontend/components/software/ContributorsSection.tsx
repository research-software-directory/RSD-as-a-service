// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Contributor, Person} from '../../types/Contributor'
import PageContainer from '../layout/PageContainer'
import ContributorsList from './ContributorsList'
import ContactPersonCard from './ContactPersonCard'

function clasifyContributors(contributors: Person[]) {
  const contributorList:Person[] = []
  let contact: Person | null = null

  contributors.forEach(item => {
    // take first contact person to be show as contact
    if (item.is_contact_person === true && contact===null) {
      contact = item
      // but push it also to contributors list
      contributorList.push(item)
    } else {
      contributorList.push(item)
    }
  })
  return {
    contributorList,
    contact
  }
}

// shared component with project page for team members
export default function ContributorsSection({contributors, title='Contributors'}:
  { contributors: Person[], title?:string }) {
  // do not show section if no content
  if (typeof contributors == 'undefined' || contributors?.length===0) return null
  // clasify
  const {contact, contributorList} = clasifyContributors(contributors)
  return (
    <section className="bg-base-200">
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="software-contributors-section-title"
          className="pb-8 text-[2rem] text-primary">
          {title}
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
