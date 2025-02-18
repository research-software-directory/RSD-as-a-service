// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import {useCommunityContext} from '~/components/communities/context'
import CategoryEditTree from '~/components/category/CategoryEditTree'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useCategories from '~/components/category/useCategories'

export default function CommunityCategories() {
  const {community} = useCommunityContext()
  const {loading,error,roots,onMutation} = useCategories({community:community.id})

  if (loading) {
    return (
      <BaseSurfaceRounded
        className="flex-1 p-24 mb-12 flex justify-center items-top"
        type="section"
      >
        <CircularProgress />
      </BaseSurfaceRounded>
    )
  }

  return (
    <BaseSurfaceRounded
      className="flex-1 p-8 mb-12 flex flex-col gap-4"
      type="section"
    >
      {error && <Alert severity="error">{error}</Alert>}
      {roots &&
        <CategoryEditTree
          title="Categories"
          roots={roots}
          community={community.id}
          organisation={null}
          onMutation={onMutation}
          // different labels for communities
          labels={{
            short_name:'Label shown on page',
            name:'Full name or description shown on mouse over short name/label'
          }}
        />
      }
    </BaseSurfaceRounded>
  )
}
