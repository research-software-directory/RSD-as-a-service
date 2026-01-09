// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import EditIcon from '@mui/icons-material/Edit'
import ArticleIcon from '@mui/icons-material/Article'

import {useSession} from '~/auth/AuthProvider'
import StatusBanner from '~/components/cards/StatusBanner'
import IconBtnMenuOnAction, {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import {NewsListItemProps} from '~/components/news/apiNews'
import useOnNewsAction, {NewsAction} from '../useOnNewsAction'

export function getMenuOptions(item:NewsListItemProps){
  const menuOptions:IconBtnMenuOption<NewsAction>[]=[{
    type:'action',
    key: 'edit',
    label: 'Edit article',
    icon: <EditIcon />,
    action:{
      type: 'EDIT',
      payload: `/news/${item.publication_date}/${item.slug}/edit`
    }
  },{
    type:'action',
    key: 'view',
    label: 'View article',
    icon: <ArticleIcon />,
    action:{
      type: 'VIEW',
      payload: `/news/${item.publication_date}/${item.slug}`
    }
  }]
  return menuOptions
}

export default function NewsCardNav({item}:{item:NewsListItemProps}) {
  const {user} = useSession()
  const onNewsAction = useOnNewsAction()

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
            onAction={onNewsAction}
          />
        </div>
      </div>
    )
  }

  return null
}
