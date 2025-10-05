// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import AnnouncementsForm from './AnnouncementsForm'
import ContentLoader from '~/components/layout/ContentLoader'
import useAnnouncement from './useAnnouncement'

export default function AdminAnnouncements() {
  const {loading,announcement} = useAnnouncement()

  // console.group('AnnouncementsPage')
  // console.log('loading...', loading)
  // console.log('announcement...', announcement)
  // console.groupEnd()

  if (loading) return (
    <ContentLoader />
  )

  return (
    <AnnouncementsForm data={announcement} />
  )
}
