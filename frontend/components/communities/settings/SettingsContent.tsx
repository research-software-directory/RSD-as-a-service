// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import CommunityAboutPage from './about-page'
import CommunityMaintainers from './maintainers'
import CommunityGeneralSettings from './general'


export default function CommunitySettingsContent() {
  const router = useRouter()
  const tab = router.query['tab']?.toString() ?? ''

  switch (tab) {
    case 'about':
      return <CommunityAboutPage />
    case 'maintainers':
      return <CommunityMaintainers />
    default:
      return <CommunityGeneralSettings/>
  }

}
