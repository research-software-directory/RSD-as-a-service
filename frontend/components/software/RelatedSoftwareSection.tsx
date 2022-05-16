import PageContainer from '../layout/PageContainer'
import SoftwareGrid, {SoftwareGridType} from './SoftwareGrid'

export default function RelatedSoftwareSection({relatedSoftware=[]}: {relatedSoftware: SoftwareGridType[]}) {
  // do not render if no data
  if (relatedSoftware?.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary">
        Related tools
      </h2>
      <SoftwareGrid
        className="gap-[0.125rem]"
        software={relatedSoftware}
        grid={{
          height: '17rem',
          minWidth:'26rem',
          maxWidth:'1fr'
        }}
      />
    </PageContainer>
  )
}
