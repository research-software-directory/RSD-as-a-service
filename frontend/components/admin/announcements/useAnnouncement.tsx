// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {AnnouncementItem, getAnnouncement} from './apiAnnouncement'
import {useSession} from '~/auth/AuthProvider'


export default function useAnnouncement() {
  const {token} = useSession()
  const [loading, setLoading] = useState(true)
  const [announcement, setAnnouncement] = useState<AnnouncementItem|null>(null)

  useEffect(() => {
    let abort = false

    getAnnouncement(token).then(item => {
      if (abort) return
      setAnnouncement(item)
      setLoading(false)
    })

    return ()=>{abort=true}
  }, [token])

  return {
    announcement,
    loading
  }

}
