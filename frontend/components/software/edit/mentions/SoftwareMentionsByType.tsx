import {mentionType,MentionForSoftware,MentionEditType} from '../../../../types/MentionType'
import ContentLoader from '../../../layout/ContentLoader'
import SoftwareMentionCategories from './SoftwareMentionCategories'
import EditSectionTitle from '../EditSectionTitle'
import SoftwareMentionList from './SoftwareMentionList'

type SoftwareMentionByTypeProps = {
  loading: boolean,
  mentions: MentionByTypeState | undefined,
  token: string
  onCategoryChange: (category: MentionEditType) => void
  onDeleteMention: (pos:number) => void
}

export type MentionByTypeState = {
  category: MentionEditType,
  items: MentionForSoftware[]
}

export default function SoftwareMentionsByType(
  {loading, mentions, token, onCategoryChange, onDeleteMention}:
  SoftwareMentionByTypeProps) {
  return (
    <section className="py-8 grid grid-cols-[1fr,4fr] gap-8">
        <SoftwareMentionCategories
          category={mentions?.category ?? 'attachment'}
          onCategoryChange={onCategoryChange}
        />
        <div className="flex-1 py-2">
          <EditSectionTitle
            title={mentionType[mentions?.category ?? 'attachment']}
          />
          <div className="py-2"></div>
          {loading ?
            <ContentLoader />
            :
            <SoftwareMentionList
              category={mentions?.category ?? 'attachment'}
              items={mentions?.items ?? []}
              token={token}
              onDelete={onDeleteMention}
            />
          }
        </div>
    </section>
  )
}
