// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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
        />
      }
    </section>
  )
}
