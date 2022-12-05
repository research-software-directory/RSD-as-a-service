// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {License, ProgramingLanguages, CodePlatform, KeywordForSoftware} from '../../types/SoftwareTypes'
import PageContainer from '../layout/PageContainer'
import AboutStatement from './AboutStatement'
import SoftwareKeywords from './SoftwareKeywords'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'

type AboutSectionType = {
  brand_name: string
  description: string
  description_type: 'link' | 'markdown'
  keywords: KeywordForSoftware[]
  licenses: License[]
  repository: string | null
  platform: CodePlatform
  languages: ProgramingLanguages
}


export default function AboutSection({
  brand_name = '', description = '', keywords, licenses,
  repository, languages, platform, description_type='markdown'
}:AboutSectionType) {

  if (brand_name==='') return null

  // extract only license text
  const license = licenses?.map(item => item.license)

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
        <SoftwareKeywords keywords={keywords || []} />
        <AboutLanguages languages={languages} />
        <AboutLicense license={license || []} />
        <AboutSourceCode
          repository={repository ?? null}
          platform={platform}
        />
      </div>
    </PageContainer>
  )
}
