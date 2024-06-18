// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import useUserCommunities from './useUserCommunities'
import CommunityListItem from '~/components/communities/overview/CommunityListItem'

export default function UserCommunities() {
  const {loading,communities} = useUserCommunities()

  // console.group('UserCommunities')
  // console.log('loading...', loading)
  // console.log('communities...', communities)
  // console.groupEnd()

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  if (communities.length === 0) {
    return <NoContent />
  }

  return (
    <div
      data-testid="communities-overview-list"
      className="flex-1 my-2 flex flex-col gap-2">
      {communities.map((item) => (
        <CommunityListItem key={item.slug} community={item} />
      ))}
    </div>
  )
}
