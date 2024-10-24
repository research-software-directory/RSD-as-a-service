// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import OrganisationSettingsAboutPage from './about-page'
import OrganisationMaintainers from './maintainers'
import OrganisationGeneralSettings from './general'
import OrganisationCategories from './categories'


export default function SettingsPageContent() {
  const router = useRouter()
  const settings = router.query['settings']?.toString() ?? ''

  switch (settings) {
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
