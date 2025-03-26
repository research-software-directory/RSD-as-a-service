// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import useLoginHandler from '~/utils/loginHandler'
import LoginDialog from '~/components/login/LoginDialog'
import {useEffect} from 'react'
import AppHeader from '~/components/AppHeader'

export default function LoginPage() {
  const {showModal, handleLogin, isReady} = useLoginHandler()

  useEffect(() => {
    if (isReady) {
      handleLogin()
    } else {
      //console.log('Waiting for providers to be ready...')
    }

  }, [isReady])

  return (
    <>
      <AppHeader/>
      { showModal && (
        <LoginDialog
          open={true}
        />
      )}
    </>
  )
}
