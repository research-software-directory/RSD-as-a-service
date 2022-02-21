import {RelatedTools} from '../../types/SoftwareTypes'
import PageContainer from '../layout/PageContainer'
import SoftwareGrid, {SoftwareGridType} from './SoftwareGrid'

export default function RelatedToolsSection({relatedTools=[]}: {relatedTools: RelatedTools[]}) {
  // do not render if no data
  if (relatedTools?.length === 0) return null

  // prepare related software items to be used by SoftwareGrid
  const relatedSoftware: SoftwareGridType[] = relatedTools
    // filter out items without slug (seem to be some)
    .filter(item => item.software?.slug)
    .map(item => {
      return {
        id: item.software?.id,
        slug: item.software?.slug,
        brand_name: item.software?.brand_name,
        is_featured: false,
        short_statement: item.software?.short_statement || '',
        updated_at: null,
      }
    })

  return (
    <section>
      <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
        <h2
          data-testid="software-contributors-section-title"
          className="pb-8 text-[2rem] text-primary">
          Related tools
        </h2>
        <SoftwareGrid software={relatedSoftware} />
      </PageContainer>
    </section>
  )
}
