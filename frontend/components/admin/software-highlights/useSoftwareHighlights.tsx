// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {
  SoftwareHighlight,
  addSoftwareHighlight, deleteSoftwareHighlight,
  getSoftwareHighlights, patchSoftwareHighlights
} from './apiSoftwareHighlights'

export default function useSoftwareHighlights(token: string) {
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, count, setCount} = usePaginationWithSearch('Find highlight by name')
  const [highlights, setHighlights] = useState<SoftwareHighlight[]>([])
  const [loading, setLoading] = useState(true)

  const loadHighlight = useCallback(async() => {
    setLoading(true)
    const {highlights, count} = await getSoftwareHighlights({token, searchFor})
    setHighlights(highlights)
    setCount(count ?? 0)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows])


  useEffect(() => {
    if (token) {
      loadHighlight()
    }
  }, [loadHighlight, token])

  async function addHighlight(id: string) {
    const resp = await addSoftwareHighlight({
      id,
      position: highlights.length + 1,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to add software to highlight. ${resp.message}`)
    } else {
      await loadHighlight()
    }
  }

  async function deleteHighlight(id: string) {
    const resp = await deleteSoftwareHighlight({
      id,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to remove highlight. ${resp.message}`)
    } else {
      // remove item and renumber positions
      const newList = highlights
        .filter(item => item.id !== id)
        .map((item, pos) => {
          // renumber
          item.position = pos + 1
          return item
        })
      // update position in db
      if (newList.length > 0) {
        await sortHighlights(newList)
      } else {
        // we do not have highlights left
        setHighlights([])
      }
    }
  }

  async function sortHighlights(items: SoftwareHighlight[]) {
    const orgItems = [
      ...highlights
    ]
    // visually confirm position change
    setHighlights(items)
    // make all request
    const resp = await patchSoftwareHighlights({
      highlights: items,
      token
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to sort highlight. ${resp.message}`)
      // revert back in case of error
      setHighlights(orgItems)
    }
  }

  return {
    count,
    loading,
    highlights,
    addHighlight,
    sortHighlights,
    deleteHighlight
  }
}
