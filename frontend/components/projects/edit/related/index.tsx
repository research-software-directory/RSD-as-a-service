
import ContentLoader from '~/components/layout/ContentLoader'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useProjectContext from '../useProjectContext'
import RelatedSoftwareForProject from './RelatedSoftwareForProject'
import {cfgRelatedItems as config} from './config'
import RelatedProjectsForProject from './RelatedProjectsForProject'

export default function RelatedItems() {

  return (
    <>
      <EditSection className='xl:grid xl:grid-cols-[1fr,1fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <RelatedProjectsForProject />
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <RelatedSoftwareForProject />
        </div>
      </EditSection>
    </>
  )
}
