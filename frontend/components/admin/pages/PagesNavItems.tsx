// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Filter1Icon from '@mui/icons-material/Filter1'
import Filter2Icon from '@mui/icons-material/Filter2'
import Filter3Icon from '@mui/icons-material/Filter3'

import EditMarkdownPage from './EditMarkdownPage'

export type AdminMenuProps = {
  id: string,
  status: string,
  label: string,
  icon: JSX.Element,
  component: (props: any) => JSX.Element
  showSearch: boolean
}

export type AdminMenuItems = {
  [key:string]:AdminMenuProps
}

export const pagesMenu:AdminMenuItems = {
  about:{
    id:'about',
    label:'About page',
    icon: <Filter1Icon />,
    component: (props?) => <EditMarkdownPage {...props} />,
    status: 'Edit about page',
    showSearch: false
  },
  privacy:{
    id:'privacy',
    label:'Privacy Policy',
    icon: <Filter2Icon />,
    component: (props?) => <EditMarkdownPage {...props} />,
    status: 'Edit privacy policy page',
    showSearch: true
  },
  terms:{
    id:'terms',
    label:'Terms of service',
    icon: <Filter3Icon />,
    component: (props?) => <EditMarkdownPage {...props} />,
    status: 'Edit terms of service page',
    showSearch: true
  }
}
