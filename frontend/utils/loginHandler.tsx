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

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import useLoginProviders from '~/auth/api/useLoginProviders'
import {useRouter} from 'next/router'

interface LoginHandler {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogin: () => void;
  isReady: boolean;
}

const useLoginHandler = (): LoginHandler => {
  const providers = useLoginProviders()
  const {status} = useSession()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (providers.length > 0) {
      setIsReady(true)
    }
  }, [providers])

  const handleLogin = () => {
    if (!isReady) return

    if (status == 'loading') {
      return null
    }

    if (status === 'authenticated') {
      router.push('/')
    }

    if (providers) {
      if (providers.length > 1) {
        setShowModal(true)
      } else if (providers.length === 1) {
        router.push(providers[0]?.redirectUrl)
      }
    }
  }

  return {showModal, setShowModal, handleLogin, isReady}
}

export default useLoginHandler
