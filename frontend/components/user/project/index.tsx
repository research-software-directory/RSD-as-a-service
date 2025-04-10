// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Pagination from '@mui/material/Pagination'

import {getPageRange} from '~/utils/pagination'
import {setDocumentCookie} from '~/utils/userSettings'
import {useUserSettings} from '~/components/organisation/context/UserSettingsContext'
import {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import SearchPanel from '~/components/user/search/SearchPanel'
import {useUserContext} from '~/components/user/context/UserContext'
import UserProjectsOverview from './UserProjectsOverview'
import useUserProjects from './useUserProjects'

export default function UserProjects() {
  const {rsd_page_layout,rsd_page_rows} = useUserSettings()
  const {counts:{project_cnt}} = useUserContext()
  // if masonry we change to grid
  const layout = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout
  const [view, setView] = useState<ProjectLayoutType>(layout)
  const [searchFor, setSearchFor] = useState<string>()
  const [rows, setRows] = useState<number>(rsd_page_rows)
  const [page, setPage] = useState<number>(0)
  const {loading, projects, count} = useUserProjects({
    searchFor,
    page,
    rows
  })
  // number of items to show in skeleton while loading
  const skeleton_items = rsd_page_rows < project_cnt ? rsd_page_rows : project_cnt ?? 3
  // number of pages for pagination at the bottom of the page
  const numPages = Math.ceil(count / rows)

  // console.group('UserProjects')
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('layout...', layout)
  // console.log('view...', view)
  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('loading...', loading)
  // console.log('projects...', projects)
  // console.log('count...', count)
  // console.log('skeleton_items...', skeleton_items)
  // console.groupEnd()

  function onSetView(view: ProjectLayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
  }

  function onSetRows(rows:number) {
    // update local view
    setRows(rows)
    // save to cookie
    setDocumentCookie(rows.toString(),'rsd_page_rows')
  }

  return (
    <div className="flex-1">
      {/* SEARCH */}
      <SearchPanel
        placeholder='Find project'
        layout={view}
        rows={rows}
        search={searchFor ?? null}
        onSearch={setSearchFor}
        onSetView={onSetView}
        onSetRows={onSetRows}
      />
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          {getPageRange(rows, page, count)}
        </div>
      </div>

      {/* PROJECT ITEMS */}
      <UserProjectsOverview
        skeleton_items={skeleton_items}
        layout={view}
        loading={loading}
        projects={projects}
      />

      {/* Pagination */}
      {numPages > 1 &&
        <div className="flex flex-wrap justify-center mt-8">
          <Pagination
            count={numPages}
            page={page + 1}
            onChange={(_, page) => {
              // handleQueryChange('page',page.toString())
              setPage(page-1)
            }}
          />
        </div>
      }
    </div>
  )
}
