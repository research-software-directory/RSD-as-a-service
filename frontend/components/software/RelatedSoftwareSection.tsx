// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useMediaQuery from '@mui/material/useMediaQuery'

import PageContainer from '~/components/layout/PageContainer'
import RelatedSoftwareGrid, {SoftwareGridType} from './RelatedSoftwareGrid'

export default function RelatedSoftwareSection({relatedSoftware = []}:Readonly<{relatedSoftware:SoftwareGridType[]}>) {
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile
  const minWidth = smallScreen ? '18rem' : '26rem'
  // do not render if no data
  if (relatedSoftware?.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr_4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary">
        Related software
      </h2>
      <RelatedSoftwareGrid
        className="gap-[0.125rem]"
        software={relatedSoftware}
        grid={{
          height: '17rem',
          minWidth,
          maxWidth:'1fr'
        }}
      />
    </PageContainer>
  )
}
