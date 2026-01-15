// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next/types'
import {app} from '~/config/app'

type MetadataProps={
  domain: string
  page_title: string
  description: string
  url: string | URL
  image_url: string[]
  other?: {[name: string]: string | number | (string | number)[]}
}

export function createMetadata({domain,page_title,description,url,image_url,other}:MetadataProps){
  const meta:Metadata = {
    title: `${page_title} | ${app.title}`,
    description,
    openGraph:{
      type: 'website',
      siteName: app.title,
      title: page_title,
      description,
      url,
    },
    other:{
      // add RSD website logo
      'og:logo':`https://${domain}/android-chrome-512x512.png`,
      ...other
    }
  }
  if (image_url?.length > 0 && meta.openGraph){
    const images:{url:string}[] = []
    // add all logo/images to openGraph
    image_url.forEach(url=>{
      images.push({url})
    })
    if (images.length > 0){
      meta.openGraph['images'] = images
    }
  }
  return meta
}
