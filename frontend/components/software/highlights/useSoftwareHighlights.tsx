// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {SoftwareHighlight, getSoftwareHighlights} from '~/components/admin/software-highlights/apiSoftwareHighlights'

export default function useSoftwareHighlights() {
  const {token} = useSession()
  const [highlights, setHighlights] = useState<SoftwareHighlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getSoftwareHighlights({
      token,
      page: 0,
      // get max. 20 items
      rows: 20,
      orderBy: 'position'
    })
    .then(data => {
      setHighlights(data.highlights)
    })
    .finally(() => setLoading(false))

  },[token])

  return {
    highlights,
    loading
  }
}
