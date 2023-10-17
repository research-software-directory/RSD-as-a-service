// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext, useContext} from 'react'
import {ProjectListItem} from '~/types/Project'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'

type PeopleContextProps={
  software_cnt: number,
  software: SoftwareOverviewItemProps[],
  project_cnt: number,
  projects: ProjectListItem[]
}

// create context
const PeopleContext = createContext<PeopleContextProps|null>(null)

// profile context provider
export function PeopleContextProvider(props:any){
  return <PeopleContext.Provider
    {...props}
  />
}

// profile context hook
export function usePeopleContext(){
  const props = useContext(PeopleContext)
  if (props===null){
    throw Error('usePeopleContext requires PeopleContextProvider at parent')
  }
  return props
}

export default PeopleContext
