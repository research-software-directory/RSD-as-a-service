// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {KeywordForSoftware} from '../../types/SoftwareTypes'
import TagListItem from '../layout/TagListItem'

export default function SoftwareKeywords({keywords = []}: { keywords: KeywordForSoftware[] }) {

  function renderTags() {
    if (keywords.length === 0) {
      return (
        <i>No keywords avaliable</i>
      )
    }
    return (
      <ul className="flex flex-wrap py-1">
        {keywords.map((item, pos) => {
          return <TagListItem key={pos} label={item.keyword}/>
        })}
      </ul>
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
