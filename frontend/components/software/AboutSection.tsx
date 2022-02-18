import {Tag,License, ProgramingLanguages} from '../../types/SoftwareTypes'
import PageContainer from '../layout/PageContainer'
import AboutStatement from './AboutStatement'
import AboutTags from './AboutTags'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'

type AboutSectionType = {
  brand_name: string
  description: string
  tags: Tag[]
  licenses: License[]
  repository: string | null
  languages: ProgramingLanguages
}


export default function AboutSection({brand_name = '', description = '', tags, licenses, repository, languages}:
  AboutSectionType) {

  if (brand_name==='') return null

  // extract only license text
  const license = licenses?.map(item => item.license)

  return (
    <PageContainer className="flex flex-col px-4 py-12 lg:flex-row lg:pt-0 lg:pb-12">
      <div className="flex-[3] 2xl:flex-[4] pr-12">
        <AboutStatement
          brand_name={brand_name}
          description={description}
        />
      </div>
      <div className="flex-1">
        <AboutTags tags={tags || []} />
        <AboutLanguages languages={languages} />
        <AboutLicense license={license || []} />
        <AboutSourceCode repository={repository} />
      </div>
    </PageContainer>
  )
}
