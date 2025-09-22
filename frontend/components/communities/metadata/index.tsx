// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import LanguageIcon from '@mui/icons-material/Language'

import {getHostnameFromUrl} from '~/utils/getHostname'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import KeywordList from '~/components/cards/KeywordList'
import Links from '~/components/organisation/metadata/Links'
import {useCommunityContext} from '~/components/communities/context'
import CommunityLogo from './CommunityLogo'

function Website({url}:Readonly<{url:string|null}>){
  if (!url) return null
  // extract hostname and use as title
  const title = getHostnameFromUrl(url) ?? url

  return (
    <Links links={[{
      title,
      url,
      icon: <LanguageIcon />
    }]} />
  )
}

export default function CommunityMetadata() {
  const {community,isMaintainer} = useCommunityContext()
  // generate simple list
  const keywordList = community?.keywords?.map(keyword=>keyword.keyword)

  // console.group('CommunityMetadata')
  // console.log('isMaintainer...', isMaintainer)
  // console.log('keywordList...', keywordList)
  // console.log('community...', community)
  // console.groupEnd()

  return (
    <section className="grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4">
      <BaseSurfaceRounded className="flex justify-center p-8 overflow-hidden relative">
        <CommunityLogo
          id={community?.id ?? ''}
          name={community?.name ?? ''}
          logo_id={community?.logo_id ?? null}
          isMaintainer={isMaintainer}
        />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="flex flex-col justify-start gap-2 p-4">
        <div className="flex-1 flex gap-8">
          <h1
            title={community?.name}
            className="flex-1 text-xl font-medium line-clamp-1">
            {community?.name}
          </h1>
          <Website url={community.website} />
        </div>
        <p className="flex-1 text-base-700 line-clamp-3 break-words py-4">
          {community?.short_description}
        </p>
        <KeywordList
          keywords={keywordList}
          visibleNumberOfKeywords={7}
        />
      </BaseSurfaceRounded>
    </section>
  )
}
