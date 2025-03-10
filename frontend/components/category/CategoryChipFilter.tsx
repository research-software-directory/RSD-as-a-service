// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment, useEffect, useState} from 'react'
import {useRouter} from 'next/router'

import {buildFilterUrl, ssrSoftwareUrl} from '~/utils/postgrestUrl'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import TagChipFilter from '~/components/layout/TagChipFilter'
import {getCommunitySlug, getOrganisationSlug} from './apiCategories'

function useFilterUrl(cat:CategoryEntry){
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>()
  const router = useRouter()
  const {short_name,community,organisation,status} = cat
  // extract tab from the pathname
  const tab = router.pathname.split('/')[1]

  useEffect(()=>{
    if (short_name && tab){
      // GLOBAL category - software overview page
      if(community===null && organisation===null){
        const url = ssrSoftwareUrl({categories: [short_name]})
        setUrl(url)
        setLoading(false)
      }
      // ORGANISATION category
      if (organisation){
        getOrganisationSlug(organisation).then(rsd_path=>{
          if (rsd_path){
            // build URL for organisation filter
            const url = `/organisations${buildFilterUrl({categories: [short_name]},rsd_path)}&tab=${tab}`
            setUrl(url)
          }
          setLoading(false)
        })
      } else if (community){
        // COMMUNITIES category
        getCommunitySlug(community).then(slug=>{
          if (slug){
            // build URL for community filter
            let view = `${slug}/${tab}`
            if (status==='pending'){
              // pending software is on requests tab
              view = `${slug}/requests`
            }else if (status==='rejected'){
              view = `${slug}/rejected`
            }
            const url = `/communities${buildFilterUrl({categories: [short_name]},view)}`
            // update url
            setUrl(url)
          }
          setLoading(false)
        })
      }else{
        // no URL
        setLoading(false)
      }
    }
  },[short_name,organisation,community,tab,status])

  return {
    loading,
    url
  }
}

function CategoryChipItem({cat}:Readonly<{cat:CategoryEntry}>){
  // construct filter url
  const {loading,url} = useFilterUrl(cat)

  return (
    <TagChipFilter
      key={cat.id}
      title={cat.name}
      label={cat.short_name}
      capitalize={false}
      url={url}
      loading={loading}
    />
  )
}

export function CategoryChipFilter({nodes}:{nodes:TreeNode<CategoryEntry>[]}){
  return nodes.map(node=>{
    const cat = node.getValue()
    const children = node.children()

    // console.group("CategoryChipFilter")
    // console.log("cat...",cat)
    // console.log("url...",url)
    // console.groupEnd()

    return (
      <Fragment key={cat.id}>
        <CategoryChipItem
          key={cat.id}
          cat={cat}
        />
        <CategoryChipFilter nodes={children} />
      </Fragment>
    )

  })
}
