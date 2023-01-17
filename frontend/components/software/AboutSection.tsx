// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {License, ProgramingLanguages, CodePlatform, KeywordForSoftware} from '../../types/SoftwareTypes'
import PageContainer from '../layout/PageContainer'
import AboutStatement from './AboutStatement'
import SoftwareKeywords from './SoftwareKeywords'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'
import SoftwareLogo from './SoftwareLogo'

type AboutSectionType = {
  brand_name: string
  description: string
  description_type: 'link' | 'markdown'
  keywords: KeywordForSoftware[]
  licenses: License[]
  repository: string | null
  platform: CodePlatform
  languages: ProgramingLanguages,
  image_id: string | null
}


export default function AboutSection(props:AboutSectionType) {
  const {
    brand_name = '', description = '', keywords, licenses,
    repository, languages, platform, description_type = 'markdown',
    image_id
  } = props
  if (brand_name==='') return null

  // extract only license text
  const license = licenses?.map(item => item.license)

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
        <SoftwareKeywords keywords={keywords || []} />
        <AboutLanguages languages={languages} platform={platform} />
        <AboutLicense license={license || []} />
        <AboutSourceCode
          repository={repository ?? null}
          platform={platform}
        />
      </div>
    </PageContainer>
  )
}
