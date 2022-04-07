
import {ContributorMentionCount} from '../../utils/getSoftware'
import ContentHeader from '../layout/ContentHeader'
import SoftwareStatCounter from './SoftwareStatCounter'

export default function SoftwareIntroSection({brand_name, short_statement, counts}:
  { brand_name: string, short_statement: string, counts: ContributorMentionCount }) {

  function getMentionsLabel() {
    if (counts?.mention_cnt === 1) {
      return 'mention'
    }
    return 'mentions'
  }

  function getContributorsLabel() {
    if (counts?.contributor_cnt === 1) {
      return 'contributor'
    }
    return 'contributors'
  }

  return (
    <ContentHeader
      title={brand_name}
      subtitle={short_statement}
    >
      <SoftwareStatCounter
        label={getMentionsLabel()}
        value={counts?.mention_cnt}
      />
      <SoftwareStatCounter
        label={getContributorsLabel()}
        value={counts?.contributor_cnt}
      />
    </ContentHeader>
  )
}
