// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {NextRouter, useRouter} from 'next/router'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import StatusBanner from '~/components/cards/StatusBanner'
import IconBtnMenuOnAction, {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import {NewsListItem} from '~/components/news/apiNews'

export type NewsAction={
  type: 'VIEW'|'EDIT',
  payload: string
}

export function getMenuOptions(item:NewsListItem){
  const menuOptions:IconBtnMenuOption<NewsAction>[]=[{
    type:'action',
    key: 'view',
    label: 'View article',
    action:{
      type: 'VIEW',
      payload: `/news/${item.publication_date}/${item.slug}`
    }
  },{
    type:'action',
    key: 'edit',
    label: 'Edit article',
    action:{
      type: 'EDIT',
      payload: `/news/${item.publication_date}/${item.slug}/edit`
    }
  }]
  return menuOptions
}

export function onNewsAction(action:NewsAction,router:NextRouter){
  // console.log('onAction...', action)
  switch(action.type){
    case 'VIEW':
      router.push(action.payload)
      break
    case 'EDIT':
      router.push(action.payload)
      break
    default:
      logger(`Not support action type ${action.type}`,'warn')
  }
}

export default function NewsCardNav({item}:{item:NewsListItem}) {
  const router = useRouter()
  const {user} = useSession()

  if (user?.role === 'rsd_admin'){
    return (
      <div className="w-full flex items-center absolute top-0 pt-2 pr-2 opacity-70 hover:opacity-100 z-10">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-start gap-1 pt-1 text-xs">
            {/* reusing software card status banner */}
            <StatusBanner
              status="approved"
              is_featured={false}
              is_published={item.is_published}
              borderRadius='0 0.75rem 0.75rem 0'
            />
          </div>
        </div>
        <div className="bg-base-100 rounded-[50%]">
          <IconBtnMenuOnAction
            options={getMenuOptions(item)}
            onAction={(action)=>onNewsAction(action,router)}
          />
        </div>
      </div>
    )
  }

  return null
}
