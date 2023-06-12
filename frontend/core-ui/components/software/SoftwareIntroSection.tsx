// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ContributorMentionCount} from '../../utils/getSoftware'
import ContentHeader from '../layout/ContentHeader'
import SoftwareStatCounter from './SoftwareStatCounter'

type SoftwareIntroSectionProps = {
  brand_name: string,
  short_statement: string,
  counts: ContributorMentionCount
}

export default function SoftwareIntroSection(props:SoftwareIntroSectionProps) {
  const {brand_name,short_statement,counts} = props
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
