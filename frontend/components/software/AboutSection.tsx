import {Tag,License} from '../../utils/getSoftware'
import PageContainer from '../layout/PageContainer'
import AboutStatement from './AboutStatement'
import AboutTags from './AboutTags'
import AboutLanguages from './AboutLanguages'
import AboutLicense from './AboutLicense'
import AboutSourceCode from './AboutSourceCode'
import {RepositoryUrl} from '../../types/SoftwareItem'

export default function AboutSection({brand_name = '', bullets = '', read_more = '', tags, licenses, repositories}:
  { brand_name: string, bullets: string, read_more: string, tags:Tag[], licenses: License[], repositories:RepositoryUrl[]}) {

  if (brand_name==='') return null

  // extract only license text
  const license = licenses?.map(item => item.license)
  // extract only repo url
  const repository = repositories?.map(item=>item?.url)

  return (
    <PageContainer className="flex flex-col px-4 py-12 lg:flex-row lg:pt-0 lg:pb-12">
      <div className="flex-[3] pr-4">
        <AboutStatement
          brand_name={brand_name}
          bullets={bullets}
          read_more={read_more}
        />
      </div>
      <div className="flex-1 lg:pl-8">
        <AboutTags tags={tags || []} />
        <AboutLanguages languages={['Test 1', 'Test 2', 'Test 3']} />
        <AboutLicense license={license || []} />
        <AboutSourceCode repository={repository} />
      </div>
    </PageContainer>
  )
}
