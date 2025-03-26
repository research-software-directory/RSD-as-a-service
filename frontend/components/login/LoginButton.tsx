// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import useLoginHandler from '~/utils/loginHandler'
import LoginDialog from './LoginDialog'
import {useSession} from '~/auth'
import UserMenu from '~/components/layout/UserMenu'

export default function LoginButton() {
  const {showModal, setShowModal, handleLogin} = useLoginHandler()
  const {status} = useSession()

  if (status === 'loading') {
    return null
  }

  if (status === 'authenticated') {
    // we show user menu with the avatar and user specific options
    return (
      <UserMenu />
    )
  }

  return (
    <div className="whitespace-nowrap ml-2">
      <button
        tabIndex={0}
        onClick={handleLogin}
      >
          Sign in
      </button>
      { showModal && (
        <LoginDialog
          open={showModal}
          onClose={()=>setShowModal(false)}
        />
      )}
    </div>
  )

}
