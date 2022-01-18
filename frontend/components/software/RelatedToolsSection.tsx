import {SoftwareItem} from '../../types/SoftwareItem'
import {RelatedTools} from '../../utils/getSoftware'
import PageContainer from '../layout/PageContainer'

import SoftwareGrid from './SoftwareGrid'


export default function RelatedToolsSection({relatedTools=[]}: {relatedTools: RelatedTools[]}) {
  // do not render if no data
  if (relatedTools?.length === 0) return null

  // prepare related software items to be used by SoftwareGrid
  const relatedSoftware:SoftwareItem[] = relatedTools.map(item => {
    return {
      id: item.software.id,
      slug: item.software.slug,
      brand_name: item.software.brand_name,
      bullets: null,
      concept_doi: '',
      get_started_url: '',
      // we do not use featured software layout
      is_featured: false,
      is_published: true,
      read_more: null,
      short_statement: item.software.short_statement||'',
      created_at: '',
      updated_at: null,
      repository_url:[]
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
        <SoftwareGrid software={relatedSoftware as SoftwareItem[]} />
      </PageContainer>
    </section>
  )
}
