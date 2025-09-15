// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import OrganisationSettingsAboutPage from './about-page'
import OrganisationMaintainers from './maintainers'
import OrganisationGeneralSettings from './general'
import OrganisationCategories from './categories'
import {SettingsPageId} from './SettingsNavItems'

type SettingsPageContentProps=Readonly<{
  page: SettingsPageId
}>

export default function SettingsPageContent({page}:SettingsPageContentProps) {

  switch (page) {
    case 'about':
      return <OrganisationSettingsAboutPage />
    case 'maintainers':
      return <OrganisationMaintainers />
    case 'categories':
      return <OrganisationCategories />
    default:
      return <OrganisationGeneralSettings/>
  }

}
