// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import CategoryEditTree from '~/components/category/CategoryEditTree'
import {useEffect, useState} from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import {useCommunityContext} from '~/components/communities/context'

export default function CommunityCategories() {
  const [roots, setRoots] = useState<TreeNode<CategoryEntry>[] | null> (null)
  const [error, setError] = useState<string | null> (null)
  const [loading, setLoading] = useState<boolean> (true)

  const {community} = useCommunityContext()

  useEffect(() => {
    loadCategoryRoots(community.id)
      .then(roots => {
        setRoots(roots)
        setError(null)
      })
      .catch(e => {
        console.error(e)
        setError('Couldn\'t load the categories, please try again or contact us')
        setRoots(null)
      })
      .finally(() => setLoading(false))
  }, [community])

  function rerender() {
    if (roots !== null) {
      setRoots([...roots])
    }
  }

  return (
    <>
      {loading && <CircularProgress />}
      {error && <div><Alert severity="error">{error}</Alert></div>}
      {roots && <CategoryEditTree roots={roots} community={community.id} onMutation={rerender}></CategoryEditTree>}
    </>
  )
}
