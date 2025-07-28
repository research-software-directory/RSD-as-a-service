// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import PageBreadcrumbs from '../layout/PageBreadcrumbs'
import {TabKey} from './tabs/CommunityTabItems'
import CommunityMetadata from './metadata'
import CommunityTabs from './tabs'
import {CommunityProvider} from './context'
import {EditCommunityProps} from './apiCommunities'

type CommunityPageProps={
  selectTab: TabKey
  community: EditCommunityProps
  slug: string[]
  isMaintainer: boolean
  children: JSX.Element | JSX.Element[]
}

export default function CommunityPage({
  community,isMaintainer,
  slug, children, selectTab
}:CommunityPageProps) {
  return (
    <BackgroundAndLayout>
      <CommunityProvider
        community={community}
        isMaintainer={isMaintainer}
      >
        {/* COMMUNITY HEADER */}
        <PageBreadcrumbs
          slug={slug}
          root={{
            label:'communities',
            path:'/communities'
          }}
        />

        <CommunityMetadata/>

        {/* TABS */}
        <CommunityTabs
          tab={selectTab}
          software_cnt={community.software_cnt ?? 0}
          pending_cnt={community.pending_cnt ?? 0}
          rejected_cnt={community.rejected_cnt ?? 0}
          description={community.description ?? null}
          isMaintainer={isMaintainer}
        />

        {/* TAB CONTENT */}
        <section className="mt-4 flex md:min-h-[45rem]">
          {children}
        </section>
      </CommunityProvider>
    </BackgroundAndLayout>
  )
}
