// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSearchParams} from 'next/navigation'

import CommunityAboutPage from './about-page'
import CommunityMaintainers from './maintainers'
import CommunityGeneralSettings from './general'
import CommunityCategories from './categories'


export default function CommunitySettingsContent() {
  const searchParam = useSearchParams()
  const tab = searchParam?.get('nav') ?? 'general'

  switch (tab) {
    case 'about':
      return <CommunityAboutPage />
    case 'maintainers':
      return <CommunityMaintainers />
    case 'categories':
      return <CommunityCategories />
    default:
      return <CommunityGeneralSettings/>
  }

}
