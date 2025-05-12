// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import List from '@mui/material/List'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {LoginForAccount} from './apiLoginForAccount'
import {LoginItem} from './LoginItem'
import {useLoginForUser} from './useLoginForUser'

type DeleteAccountModal={
  open: boolean
  account?: LoginForAccount
}

export default function AuthenticationMethods() {
  const {logins,deleteLogin} = useLoginForUser()
  const [modal, setModal] = useState<DeleteAccountModal>({
    open: false
  })

  return (
    <div>
      <h3>Authentication methods</h3>
      <List dense={true}>
        {logins.map(account=>{
          // when only one account left we cannot delete it
          // we cannot delete ORCID account as long as profile is public
          if (logins.length===1){
            return <LoginItem
              key={account.id}
              account={account}
            />
          }
          return <LoginItem
            key={account.id}
            account={account}
            onDelete={()=>setModal({
              open:true,
              account
            })}
          />
        })}
      </List>

      <ConfirmDeleteModal
        open={modal.open}
        title="Remove authentication method"
        body={
          <p>
            Are you sure you want to delete <strong>{modal?.account?.provider} authentication method</strong>?
          </p>
        }
        onCancel={() => {
          setModal({
            open: false
          })
        }}
        onDelete={() => {
          if (modal?.account?.['id']){
            deleteLogin(modal.account.id)
            setModal({
              open: false
            })
          }
        }}
      />
    </div>
  )
}
