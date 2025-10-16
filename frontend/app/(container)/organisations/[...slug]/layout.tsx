// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import PageBreadcrumbs from '~/components/layout/PageBreadcrumbs'
import OrganisationMetadata from '~/components/organisation/metadata'
import {getOrganisationBySlug} from '~/components/organisation/apiOrganisations'
import {OrganisationProvider} from '~/components/organisation/context/OrganisationContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import OrganisationTabs from '~/components/organisation/tabs/OrganisationTabs'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(
  {params}:{params: Promise<{ slug: string[] }>}
): Promise<Metadata> {
  // read route params
  const {slug} = await params
  const {token} = await getUserSettings()

  // find organisation by slug
  const resp = await getOrganisationBySlug({
    slug: slug ?? [],
    token: token,
    user: null
  })

  // console.group('OrganisationPageLayout.generateMetadata')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('resp...', resp)
  // console.groupEnd()

  return {
    title: `${resp?.organisation?.name ?? 'Organisation'} | ${app.title}`,
    description: resp?.organisation?.short_description ?? 'This organisation participates in RSD',
  }
}

/**
 * (Partial) Layout of organisation page content.
 * Note! Base layout (PageBackground/AppHeader/MainContent/AppFooter) is defined in the parent layout.
 * @param param0
 * @returns
 */
export default async function OrganisationPageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  // extract slug from params
  params: Promise<{ slug: string[] }>
}>) {
  // read route params
  const [{slug},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])
  // extract user and verify token
  const user = await getUserFromToken(token ?? null)

  // find organisation by slug
  const resp = await getOrganisationBySlug({
    slug: slug ?? [],
    token: token,
    user
  })
  // if organisation is not found we return 404
  if (resp === undefined){
    notFound()
  }

  // console.group('OrganisationPageLayout')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('user...', user)
  // console.log('resp...', resp)
  // console.groupEnd()

  return (
    <OrganisationProvider
      organisation={resp?.organisation}
      isMaintainer={resp.isMaintainer}
    >
      {/* ORGANISATION HEADER */}
      <PageBreadcrumbs
        slug={slug}
        root={{
          label:'organisations',
          path:'/organisations'
        }}
      />

      <OrganisationMetadata />

      {/* TABS */}
      <BaseSurfaceRounded
        className="my-4 p-2"
        type="section"
      >
        <OrganisationTabs />
      </BaseSurfaceRounded>

      {/* TAB CONTENT */}
      <section className="flex md:min-h-[55rem]">
        {children}
      </section>
    </OrganisationProvider>
  )
}
