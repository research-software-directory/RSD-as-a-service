// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logins from './logins.json'

export type LoginForAccount={
  id:string
  account:string
  provider:string
  sub:string
  name:string
  email:string|null
  home_organisation:string|null
}

export function findProviderSubInLogin(logins:LoginForAccount[],provider:string){
  try{
    const login = logins.find(item=>item?.provider===provider)
    if (login){
      return login.sub
    }
    return null
  }catch{
    return null
  }
}

export function useLoginForUser(){
  return {
    logins:logins,
    deleteLogin: jest.fn()
  }
}
