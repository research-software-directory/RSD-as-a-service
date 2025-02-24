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

function useFilterUrl({category,organisation,community}:{
  category:string,organisation:string|null,community:string|null,
}){
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>()
  const router = useRouter()
  // extract tab from the pathname
  const tab = router.pathname.split('/')[1]

  useEffect(()=>{
    if (category && tab){
      // GLOBAL category - software overview page
      if(community===null && organisation===null){
        const url = ssrSoftwareUrl({categories: [category]})
        setUrl(url)
        setLoading(false)
      }
      // ORGANISATION category
      if (organisation!==null){
        getOrganisationSlug(organisation).then(rsd_path=>{
          if (rsd_path){
            // build URL for organisation filter
            const url = `/organisations${buildFilterUrl({categories: [category]},rsd_path)}&tab=${tab}`
            setUrl(url)
          }
          setLoading(false)
        })
      }
      // COMMUNITIES category
      if (community!==null){
        getCommunitySlug(community).then(slug=>{
          if (slug){
            // build URL for community filter
            const url = `/communities${buildFilterUrl({categories: [category]},`${slug}/${tab}`)}`
            setUrl(url)
          }
          setLoading(false)
        })
      }
    }
  },[category,organisation,community,tab])

  return {
    loading,
    url
  }
}

function CategoryChipItem({cat}:{cat:CategoryEntry}){
  // construct filter url
  const {loading,url} = useFilterUrl({
    category: cat.short_name,
    organisation: cat.organisation,
    community: cat.community
  })

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
