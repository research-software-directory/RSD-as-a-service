// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {KeywordForSoftware} from '../../types/SoftwareTypes'
import TagChipFilter from '../layout/TagChipFilter'
import {ssrViewUrl} from '~/utils/postgrestUrl'
import {useRouter} from 'next/router'

export default function SoftwareKeywords({keywords = []}: { keywords: KeywordForSoftware[] }) {
  const router = useRouter()
  const view = router.pathname.split('/')[1]

  function renderTags() {
    if (keywords.length === 0) {
      return (
        <i>No keywords avaliable</i>
      )
    }
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {keywords.map((item, pos) => {
          const params = {keywords: [item.keyword]}
          const url = ssrViewUrl({view, params})
          return <TagChipFilter url={url} key={pos} label={item.keyword} />
        })}
      </div>
    )
  }

  return (
    <>
      <div className="pt-8 pb-2">
        <LocalOfferIcon color="primary" sx={{transform:'rotate(90deg)'}} />
        <span className="text-primary pl-2">Keywords</span>
      </div>
      {renderTags()}
    </>
  )
}
