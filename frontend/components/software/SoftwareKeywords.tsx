// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {KeywordForSoftware} from '~/types/SoftwareTypes'
import {ssrSoftwareUrl} from '~/utils/postgrestUrl'
import TagChipFilter from '~/components/layout/TagChipFilter'

export default function SoftwareKeywords({keywords = []}: {keywords: KeywordForSoftware[]}) {
  function renderTags() {
    if (keywords.length === 0) {
      return (
        <i>No keywords available</i>
      )
    }
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {keywords.map((item, pos) => {
          const url = ssrSoftwareUrl({keywords: [item.keyword]})
          return <TagChipFilter url={url} key={pos} label={item.keyword} />
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="pb-2">
        <LocalOfferIcon color="primary" sx={{transform:'rotate(90deg)'}} />
        <span className="text-primary pl-2">Keywords</span>
      </div>
      {renderTags()}
    </div>
  )
}
