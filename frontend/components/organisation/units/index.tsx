// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getOrganisationChildren, getOrganisationIdForSlug} from '../apiOrganisations'
import OrganisationUnits from './OrganisationUnits'

type ResearchUnitsProps = Readonly<{
  slug: string[]
}>

export default async function ResearchUnits({slug}: ResearchUnitsProps) {
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
  // get organisation units
  const units = await getOrganisationChildren({
    uuid,
    token
  })

  // console.group('OrganisationUnits')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('uuid...', uuid)
  // console.log('units...', units)
  // console.groupEnd()

  // return client side component
  return <OrganisationUnits units={units} />
}
