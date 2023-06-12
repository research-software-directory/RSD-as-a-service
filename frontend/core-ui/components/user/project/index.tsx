// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '~/auth'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import useUserProjects from './useUserProjects'
import {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import ContentLoader from '~/components/layout/ContentLoader'

export default function UserProjects({session}: { session: Session }) {
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions()
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Filter projects')
  const {loading, projects, count} = useUserProjects({
    searchFor,
    page,
    rows,
    session
  })
  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  return (
    <ProjectsGrid
      projects={projects}
      height={itemHeight}
      minWidth={minWidth}
      maxWidth={maxWidth}
      className="gap-[0.125rem] pt-4 pb-12"
    />
  )
}
