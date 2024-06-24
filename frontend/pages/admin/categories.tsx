// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import {useEffect, useState} from 'react'
import {app} from '~/config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import AdminPageWithNav from '~/components/admin/AdminPageWithNav'
import {adminPages} from '~/components/admin/AdminNav'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import CategoryEditTree from '~/components/category/CategoryEditTree'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

const pageTitle = `${adminPages['categories'].title} | Admin page | ${app.title}`

export default function AdminCategoriesPage(props: any) {

  const [roots, setRoots] = useState<TreeNode<CategoryEntry>[] | null> (null)
  const [error, setError] = useState<string | null> (null)
  const [loading, setLoading] = useState<boolean> (true)

  useEffect(() => {
    loadCategoryRoots(null)
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
  }, [])

  function rerender() {
    if (roots !== null) {
      setRoots([...roots])
    }
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminPageWithNav title={adminPages['categories'].title}>
        {loading && <CircularProgress />}
        {error && <div><Alert severity="error">{error}</Alert></div>}
        {roots && <CategoryEditTree roots={roots} community={null} onMutation={rerender}></CategoryEditTree>}
      </AdminPageWithNav>
    </DefaultLayout>
  )
}
