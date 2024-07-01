// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import useRsdSettings from '~/config/useRsdSettings'
import PageContainer from '~/components/layout/PageContainer'
import CommunityItem from './CommunityItem'
import {OrganisationGridSection} from './OrganisationsSection'

type CommunitiesSectionProps=Readonly<{
  communities:{
    slug: string,
    name: string,
    logo_id: string|null
  }[]
}>


export default function CommunitiesSection({communities = []}: CommunitiesSectionProps) {
  const {host} = useRsdSettings()
  // do not render section if no data
  if (communities?.length === 0) return null
  // do not render section if module is not enabled
  if (host?.modules?.includes('communities')===false) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
      <h2
        data-testid="software-communities-section-title"
        className="pb-8 text-[2rem] text-primary leading-10">
        Member of community
      </h2>
      <OrganisationGridSection>
        {communities.map((item, pos) => {
          return (
            <CommunityItem
              key={item.slug}
              slug={item.slug}
              name={item.name}
              logo_url={item.logo_id ? getImageUrl(item.logo_id) : null}
            />
          )
        })}
      </OrganisationGridSection>
    </PageContainer>
  )
}
