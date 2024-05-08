// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import BackgroundAndLayout from '../layout/BackgroundAndLayout'
import BaseSurfaceRounded from '../layout/BaseSurfaceRounded'
import PageBreadcrumbs from '../layout/PageBreadcrumbs'
import {UserSettingsProvider} from '../organisation/context/UserSettingsContext'
import {LayoutType} from '../software/overview/search/ViewToggleGroup'
import {CommunityListProps} from './apiCommunities'
import CommunityMetadata from './metadata'
import {TabKey} from './tabs/CommunityTabItems'
import CommunityTabs from './tabs'
import {CommunityProvider} from './context'

type CommunityPageProps={
  selectTab: TabKey
  community: CommunityListProps
  slug: string[]
  isMaintainer: boolean
  rsd_page_layout: LayoutType
  rsd_page_rows: number
  children: JSX.Element | JSX.Element[]
}

export default function CommunityPage({
  community,rsd_page_layout,isMaintainer,
  rsd_page_rows,slug, children, selectTab
}:CommunityPageProps) {
  return (
    <BackgroundAndLayout>
      <UserSettingsProvider
        settings={{
          rsd_page_layout,
          rsd_page_rows
        }}
      >
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
          <BaseSurfaceRounded
            className="my-4 p-2"
            type="section"
          >
            <CommunityTabs
              tab={selectTab}
              software_cnt={community.software_cnt ?? 0}
              description={community.description ?? null}
              isMaintainer={isMaintainer}
            />
          </BaseSurfaceRounded>
          {/* TAB CONTENT */}
          <section className="flex md:min-h-[60rem]">
            {children}
          </section>
        </CommunityProvider>
      </UserSettingsProvider>
    </BackgroundAndLayout>
  )
}
