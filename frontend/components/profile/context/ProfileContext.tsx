// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext} from 'react'
import {ProjectListItem} from '~/types/Project'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'

type ProfileContextProps={
  software_cnt: number,
  software: SoftwareOverviewItemProps[],
  project_cnt: number,
  projects: ProjectListItem[]
}

// create context
const ProfileContext = createContext<ProfileContextProps|null>(null)

// profile context provider
export function ProfileContextProvider(props:any){
  return <ProfileContext.Provider
    {...props}
  />
}

// profile context hook
export function useProfileContext(){
  const props = useContext(ProfileContext)
  if (props===null){
    throw Error('useProfileContext requires ProfileContextProvider at parent')
  }
  return props
}

export default ProfileContext
