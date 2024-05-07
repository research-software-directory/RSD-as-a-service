// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

import {
  ProgramingLanguages,
  CodePlatform, KeywordForSoftware,
  CategoriesForSoftware,
  LicenseForSoftware} from '~/types/SoftwareTypes'
import {CategoriesWithHeadlines} from '~/components/category/CategoriesWithHeadlines'
import PageContainer from '~/components/layout/PageContainer'
import {PackageManager} from './edit/package-managers/apiPackageManager'
import AboutStatement from './AboutStatement'
import SoftwareKeywords from './SoftwareKeywords'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'
import SoftwareLogo from './SoftwareLogo'
import AboutPackageManagers from './AboutPackageManagers'

type AboutSectionType = {
  brand_name: string
  description: string
  description_type: 'link' | 'markdown'
  keywords: KeywordForSoftware[]
  categories: CategoriesForSoftware
  licenses: LicenseForSoftware[]
  repository: string | null
  platform: CodePlatform
  languages: ProgramingLanguages
  image_id: string | null
  packages: PackageManager[]
}

export default function AboutSection(props:AboutSectionType) {
  const {
    brand_name = '', description = '', keywords, categories, licenses,
    repository, languages, platform, description_type = 'markdown',
    image_id, packages
  } = props
  if (brand_name==='') return null

  // extract only license text
  // const license = licenses?.map(item => item.license)

  function getSoftwareLogo() {
    if (image_id !== null) {
      return (
        <SoftwareLogo image_id={image_id} brand_name={brand_name} />
      )
    }
    return null
  }

  return (
    <PageContainer className="flex flex-col px-4 py-12 lg:flex-row lg:pt-0 lg:pb-12">
      <div className="flex-[3] 2xl:flex-[4] md:pr-12 overflow-hidden">
        <AboutStatement
          brand_name={brand_name}
          description={description}
          description_type={description_type}
        />
      </div>
      <div className="flex-1">
        {getSoftwareLogo()}
        <CategoriesWithHeadlines categories={categories} />
        <SoftwareKeywords keywords={keywords || []} />
        <AboutLanguages languages={languages} platform={platform} />
        <AboutLicense licenses={licenses || []} />
        <AboutSourceCode
          repository={repository ?? null}
          platform={platform}
        />
        <AboutPackageManagers packages={packages} />
      </div>
    </PageContainer>
  )
}
