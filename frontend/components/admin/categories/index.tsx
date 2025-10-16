// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import CategoryEditTree from '~/components/category/CategoryEditTree'
import useCategories from '~/components/category/useCategories'

export default function AdminCategories() {
  const {loading,error,roots,onMutation} = useCategories({community:null})

  if (loading){
    return (
      <section className="flex-1 flex justify-center items-start p-24">
        <CircularProgress />
      </section>
    )
  }

  return (
    <section className="flex-1 flex flex-col">
      {error && <Alert severity="error">{error}</Alert>}
      {roots &&
        <CategoryEditTree
          roots={roots}
          community={null}
          organisation={null}
          onMutation={onMutation}
          // different labels for global categories
          labels={{
            short_name:'Name displayed in sidebar if category is not a highlight',
            name:'Full name displayed in table view if category is a highlighted category'
          }}
        />
      }
    </section>
  )
}
