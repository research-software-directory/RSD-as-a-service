// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import useValidateImageSrc from '~/utils/useValidateImageSrc'

type useSoftwareOverviewLinksProps={
  id: string,
  domain: string | null
  image_id: string | null
  slug: string | null
}

export function getImgUrl({image_id,domain}:{image_id:string|null,domain?:string|null}){
  const imgSrc = getImageUrl(image_id ?? null)
  if (domain && image_id){
    return `${domain}${imgSrc}`
  }
  return imgSrc
}

export function getPageUrl({slug,domain}:{slug:string|null,domain?:string|null}){
  if (domain && domain?.endsWith('/')===true){
    return `${domain}software/${slug}`
  }
  if (domain && domain?.endsWith('/')===false){
    return `${domain}/software/${slug}`
  }
  return `/software/${slug}`
}

export function getItemKey({id,domain}:{id:string,domain?:string|null}){
  if (domain) return `${domain}${id}`
  return id
}

export function getRsdHost({hasRemotes,rsd_host}:{hasRemotes?:boolean,rsd_host?:string|null}){
  // if no remote RSD we do not show rsd_host
  if (!hasRemotes){
    return null
  }
  // if no domain these are local entries
  if (!rsd_host){
    // local rsd_host
    if (typeof (window) !== 'undefined'){
      return `@${window.location.hostname}`
    }
    return '@localhost'
  }
  // extract external domain (hostname)
  return rsd_host
}

export const visibleNumberOfKeywords: number = 3
export const visibleNumberOfProgLang: number = 3


export default function useSoftwareOverviewProps({id,domain,image_id,slug}:useSoftwareOverviewLinksProps) {
  const imgUrl = getImgUrl({domain,image_id})
  const validImg = useValidateImageSrc(imgUrl)
  const pageUrl = getPageUrl({domain,slug})
  const cardKey = getItemKey({id,domain})

  return {
    cardKey,
    imgUrl,
    pageUrl,
    validImg,
    visibleNumberOfKeywords,
    visibleNumberOfProgLang
  }
}
