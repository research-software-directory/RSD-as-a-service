// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import {createSession} from '~/auth/getSessionServerSide'
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import ProtectedContent from '~/components/layout/ProtectedContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {getOrganisationIdForSlug} from '~/components/organisation/apiOrganisations'
import SettingsNav from './SettingsNav'
import SettingsPageContent from './SettingsPageContent'
import {defaultTab, SettingsPageId} from './SettingsNavItems'

type OrganisationSettingsProps = Readonly<{
  slug: string[],
  query: {[key: string]: string | undefined}
}>

export default async function OrganisationSettings({slug,query}:OrganisationSettingsProps) {
  // extract params, user preferences and active modules
  const [{token},modules] = await Promise.all([
    getUserSettings(),
    getActiveModuleNames()
  ])
  // show 404 page if module is not enabled or slug is missing
  if (
    modules?.includes('organisations')===false ||
    slug.length === 0
  ){
    notFound()
  }
  // resolve slug to organisation id
  const uuid = await getOrganisationIdForSlug({slug, token})
  // show 404 page if organisation id missing
  if (uuid === undefined || uuid === null) {
    notFound()
  }

  // is this user maintainer of this organisation
  const {user,status} = await createSession(token ?? null)
  const isMaintainer = await isOrganisationMaintainer({
    organisation: uuid,
    account: user?.account,
    role: user?.role,
    token
  })

  const page = query['settings'] as SettingsPageId ?? defaultTab

  // console.group('OrganisationSettings')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('uuid...', uuid)
  // console.log('user...', user)
  // console.log('status...', status)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('page...', page)
  // console.groupEnd()

  return (
    <ProtectedContent
      status={status}
      role={user?.role}
      isMaintainer={isMaintainer}
    >
      <UserAgreementModal />
      <div className="flex-1 grid grid-cols-[1fr_4fr] gap-4">
        <BaseSurfaceRounded
          className="mb-12 p-4"
        >
          <SettingsNav />
        </BaseSurfaceRounded>
        {/* dynamic load of settings page */}
        <BaseSurfaceRounded
          className="flex-1 flex flex-col mb-12 p-8"
          type="section"
        >
          <SettingsPageContent page={page} />
        </BaseSurfaceRounded>
      </div>
    </ProtectedContent>
  )
}
