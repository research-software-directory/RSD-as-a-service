// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'

import {buildFilterUrl, ssrSoftwareUrl} from '~/utils/postgrestUrl'
import {CategoryEntry} from '~/types/Category'
import {getCommunitySlug, getOrganisationSlug} from './apiCategories'

export default function useCategoryFilterUrl(cat:CategoryEntry){
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState<string>()
  const {short_name,community,organisation,status} = cat
  // extract tab from the pathname
  const pathname = usePathname()
  const tab = pathname?.split('/')[1]

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
