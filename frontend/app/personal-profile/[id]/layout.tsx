// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import MailIcon from '@mui/icons-material/Mail'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

import ProfileTile from '../components/ProfileTile'
import ContactTile, {ContactEntry} from '../components/ContactTile'
import RsdTabBar, {RsdTabItem} from 'app/_components/RsdTabBar'
import {getProfileData} from '../lib/getProfileData'
import {getRsdToken, getAllCookie, getAllHeaders} from 'app/_lib/auth'

export default async function ProfileLayout({children, params} : {children: React.ReactNode, params: Promise<{id: string}>}) {
  const {id} = await params
  const token = await getRsdToken()
  const {profileData} = await getProfileData(id, token)

  if (profileData && !profileData.is_public) {
    return <p>No public profile for this user available.</p>
  }

  const profileTabs: RsdTabItem[] = [
  {
    id: 'profile',
    label: 'Personal',
    icon: <PersonIcon />,
    href: `/personal-profile/${id}`,
    visible: true
  },
  {
    id: 'software',
    label: 'Software',
    icon: <TerminalIcon />,
    href: `/personal-profile/${id}/software`,
    visible: true
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <ListAltIcon />,
    href: `/personal-profile/${id}/projects`,
    visible: true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsOutlinedIcon />,
    href: `/personal-profile/${id}/settings`,
    visible: true
  }
  ]

  const contactEntries: ContactEntry[] = [
    {
      value: profileData?.email_address ?? '',
      icon: <MailIcon />,
      href: profileData?.email_address ? `mailto:${profileData.email_address}` : ''
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-screen-2xl mx-auto p-4">
      <div className="col-span-1 flex flex-col gap-6">
        <ProfileTile
          profile_id={id}
          first_name={profileData?.given_names}
          last_name={profileData?.family_names}
          role={profileData?.role}
          affiliation={profileData?.affiliation}
        />
        <ContactTile entries={contactEntries}/>
      </div>
      <div className="col-span-2 mb-4">
        <RsdTabBar tabBarItems={profileTabs}/>
        {children}
      </div>
    </div>
  )
}
