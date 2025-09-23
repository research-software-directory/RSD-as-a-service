// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

import {
  KeywordForSoftware,
  CategoriesForSoftware,
  LicenseForSoftware
} from '~/types/SoftwareTypes'
import PageContainer from '~/components/layout/PageContainer'
import CategoriesSidebar from '~/components/software/CategoriesSidebar'
import {PackageManager} from './edit/package-managers/apiPackageManager'
import {RepositoryForSoftware} from './edit/repositories/apiRepositories'
import {SoftwareHeritageItem} from './edit/software-heritage/apiSoftwareHeritage'
import AboutStatement from './AboutStatement'
import SoftwareKeywords from './SoftwareKeywords'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'
import SoftwareLogo from './SoftwareLogo'
import AboutPackageManagers from './AboutPackageManagers'
import AboutSoftwareHeritage from './AboutSoftwareHeritage'

type AboutSectionType = {
  brand_name: string
  description: string
  description_type: 'link' | 'markdown'
  keywords: KeywordForSoftware[]
  categories: CategoriesForSoftware
  licenses: LicenseForSoftware[]
  image_id: string | null
  packages: PackageManager[]
  swhids: SoftwareHeritageItem[]
  repositories: RepositoryForSoftware[]
}

export default function AboutSection(props:AboutSectionType) {
  const {
    brand_name = '', description = '', keywords, categories, licenses,
    repositories, description_type = 'markdown',
    image_id, packages, swhids
  } = props

  if (brand_name==='') return null

  return (
    <PageContainer className="flex flex-col px-4 py-12 lg:flex-row lg:gap-12 lg:pb-12">
      <div className="flex-3 overflow-hidden md:pb-12">
        <AboutStatement
          brand_name={brand_name}
          description={description}
          description_type={description_type}
        />
      </div>

      {/* SIDEBAR */}
      <div className="flex-1 flex flex-col gap-8">
        {
          image_id ?
            <SoftwareLogo image_id={image_id} brand_name={brand_name} />
            : null
        }

        <SoftwareKeywords keywords={keywords} />

        {/* use first repo for this stats */}
        <AboutLanguages
          languages={repositories[0]?.languages}
          platform={repositories[0]?.code_platform ?? undefined}
        />

        <AboutLicense licenses={licenses || []} />

        <AboutSourceCode repositories={repositories} />

        <AboutPackageManagers packages={packages} />

        <AboutSoftwareHeritage swhids={swhids} />

        <CategoriesSidebar categories={categories} />
      </div>
    </PageContainer>
  )
}
