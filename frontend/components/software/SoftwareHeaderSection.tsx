// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ContentHeader from '../layout/ContentHeader'
import SoftwareStatCounter from './SoftwareStatCounter'

type SoftwareIntroSectionProps = Readonly<{
  brand_name: string,
  short_statement: string,
  counts: {
    mention_cnt: number,
    contributor_cnt: number
  }
}>

export default function SoftwareHeaderSection(props:SoftwareIntroSectionProps) {
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
