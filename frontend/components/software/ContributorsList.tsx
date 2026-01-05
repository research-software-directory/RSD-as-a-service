// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import Button from '@mui/material/Button'
import LaunchIcon from '@mui/icons-material/Launch'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayName, getDisplayInitials} from '~/utils/getDisplayName'
import {Person} from '~/types/Contributor'
import PersonalInfo from './PersonalInfo'
import useContributorList from './useContributorList'
import ContributorAvatar from './ContributorAvatar'

type GetMoreIconButtonProps={
  showAll: boolean
  showLess: boolean
  onShowAll: ()=>void
  onShowLess: ()=>void
}

function ShowButton({showAll,showLess,onShowAll,onShowLess}:GetMoreIconButtonProps){
  // console.group('ShowToggleButton')
  // console.log('showAll...', showAll)
  // console.log('showLess...',showLess)
  // console.groupEnd()
  // show all button
  if (showAll===true){
    return (
      <div className="flex justify-start">
        <Button
          title='Show all items'
          aria-label="Show all items"
          onClick={onShowAll}
          size="large"
          startIcon = {<ExpandMoreIcon />}
        >
          Show all
        </Button>
      </div>
    )
  }
  // show top X items defined by limit
  if (showLess===true){
    return (
      <div className="flex justify-start">
        <Button
          title='Show less items'
          aria-label="Show less items"
          onClick={onShowLess}
          size="large"
          startIcon = {<ExpandLessIcon />}
        >
          Show less
        </Button>
      </div>
    )
  }
  // do not render button
  return null
}

export default function ContributorsList({contributors,section='software'}: {contributors: Person[],section:'software'|'projects'}) {
  // show top 12 items
  const topItems = 12
  const [limit,setLimit] = useState(topItems)
  const {persons,hasMore} = useContributorList({
    items:contributors,
    limit
  })
  // do not render component if no data
  if (persons?.length === 0) return null

  // console.group('ContributorsList')
  // console.log('contributors...', contributors)
  // console.log('persons...', persons)
  // console.log('limit...',limit)
  // console.log('hasMore...',hasMore)
  // console.groupEnd()

  return (
    <>
      <div className="gap-4 mt-12 md:grid md:grid-cols-2 hd:grid-cols-3 2xl:mt-0">
        {persons.map(item => {
          const displayName = getDisplayName(item)
          const avatarUrl = getImageUrl(item.avatar_id) ?? ''
          if (displayName) {
            return (
              <div key={displayName} className="flex py-4 pr-4 md:pr-8 2xl:pr-12 2xl:pb-8">
                <ContributorAvatar
                  avatarUrl={avatarUrl}
                  displayName={displayName}
                  displayInitials={getDisplayInitials(item)}
                />
                <div className='flex-1'>
                  <div className="text-xl font-medium">
                    {item?.is_public ?
                      <a href={`/persons/${item.account}/${section}`} className="flex gap-2 items-center">
                        {displayName} <LaunchIcon sx={{width:'1rem'}}/>
                      </a>
                      :
                      <span>{displayName}</span>
                    }
                  </div>
                  <PersonalInfo {...item} />
                </div>
              </div>
            )
          }
          return null
        })
        }
      </div>
      <ShowButton
        showAll={hasMore}
        showLess={contributors.length > topItems}
        onShowAll={()=>setLimit(contributors.length)}
        onShowLess={()=>setLimit(topItems)}
      />
    </>
  )
}
