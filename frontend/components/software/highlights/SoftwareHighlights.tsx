// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {HighlightsCarousel} from './HighlightsCarousel'
import useSoftwareHighlights from './useSoftwareHighlights'

export default function SoftwareHighlights() {
  const {highlights} = useSoftwareHighlights()

  // console.group('SoftwareHighlights')
  // console.log('loading...', loading)
  // console.log('highlights...', highlights)
  // console.groupEnd()

  // if there are no hightlights we do not show this section
  if (highlights.length===0) return null

  return (
    <div className="py-8">
      <HighlightsCarousel items={highlights} />
    </div>
  )
}
