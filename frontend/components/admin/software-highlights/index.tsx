// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import AddSoftwareHighlights from './AddSoftwareHighlights'
import SortableHighlightsList from './SortableHighlightList'
import useSoftwareHighlights from './useSoftwareHighlights'

export default function AdminSoftwareHighlightsPage() {
  const {token} = useSession()
  const {highlights, loading, addHighlight, sortHighlights, deleteHighlight} = useSoftwareHighlights(token)

  // console.group('AdminSoftwareHighlight')
  // console.log('highlights...', highlights)
  // console.groupEnd()

  return (
    <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-8">
      <div>
        <h2 className="flex pr-4 pb-4 justify-between">
          <span>Highlights</span>
          <span>{highlights.length}</span>
        </h2>
        <SortableHighlightsList
          highlights={highlights}
          loading={loading}
          onDelete={deleteHighlight}
          onSorted={sortHighlights}
        />
      </div>
      <AddSoftwareHighlights
        highlights={highlights}
        onAddSoftware={addHighlight}
      />
    </section>
  )
}
