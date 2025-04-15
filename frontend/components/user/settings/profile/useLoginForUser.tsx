// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useUserContext} from '~/components/user/context/UserContext'
import {deleteFromOrcidList, deleteLoginForAccount} from './apiLoginForAccount'

/**
 * LoginForAccount hook on user/settings page based on user context.
 * NOTE! This hook depends on UserContext
 * @returns
 */
export function useLoginForUser(){
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {logins,removeLogin} = useUserContext()

  async function deleteLogin(id:string){
    const resp = await deleteLoginForAccount(id,token)
    if (resp.status!==200){
      showErrorMessage(`Failed to remove login. ${resp.message}`)
    }else{
      const acc = logins.find(account=>account.id===id)
      // for ORCID account remove it from orcid list too
      if (acc?.provider==='orcid'){
        deleteFromOrcidList(acc.sub,token)
      }
      // remove login from user context
      removeLogin(id)
    }
  }

  return {
    logins,
    deleteLogin
  }
}
