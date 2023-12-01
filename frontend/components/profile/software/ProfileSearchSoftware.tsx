// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import ProfileSearchPanel from '~/components/profile/ProfileSearchPanel'

type ProfileSearchSoftware = {
  count: number
  layout: ProjectLayoutType
  setView: (view:ProjectLayoutType)=>void
}


export default function ProfileSearchSoftware({
  count, layout, setView
}: ProfileSearchSoftware) {
  const {search,page,rows} = useSoftwareParams()
  const {handleQueryChange} = useQueryChange()

  const placeholder = 'Find software'

  // console.group('ProfileSearchSoftware')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.groupEnd()

  return (
    <section data-testid="search-section">
      <ProfileSearchPanel
        placeholder={placeholder}
        layout={layout}
        rows={rows}
        search={search}
        onSetView={setView}
        handleQueryChange={handleQueryChange}
      />
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          Page {page ?? 1} of {count} results
        </div>
      </div>
    </section>
  )
}
