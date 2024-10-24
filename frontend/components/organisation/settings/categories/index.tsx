// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import CategoryEditTree from '~/components/category/CategoryEditTree'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useCategories from '~/components/category/useCategories'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'

export default function OrganisationCategories() {
  const {id} = useOrganisationContext()
  const {loading,error,roots,onMutation} = useCategories({organisation:id})

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
          community={null}
          organisation={id ?? null}
          onMutation={onMutation}
        />
      }
    </BaseSurfaceRounded>
  )
}
