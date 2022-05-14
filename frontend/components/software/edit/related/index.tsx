
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useSoftwareContext from '../useSoftwareContext'
import RelatedSoftwareForProject from './RelatedSoftwareForSoftware'
import {cfgRelatedItems as config} from './config'
import RelatedProjectsForProject from './RelatedProjectsForSoftware'

export default function RelatedItems() {
  const {loading} = useSoftwareContext()

  return (
    <>
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <EditSectionTitle
            title={config.relatedSoftware.title}
            subtitle={config.relatedSoftware.subtitle}
          />
          <RelatedSoftwareForProject />
        </div>
        <div className="py-4 xl:my-0">
          <EditSectionTitle
            title={config.relatedProject.title}
            subtitle={config.relatedProject.subtitle}
          />
          <RelatedProjectsForProject />
        </div>
      </EditSection>
      {loading ? <ContentLoader /> : null}
    </>
  )
}
