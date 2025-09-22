// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {SoftwareOfOrganisation} from '~/types/Organisation'
import {getSoftwareForOrganisation} from '../apiOrganisations'
import useOrganisationContext from '../context/useOrganisationContext'
import useSoftwareParams from './filters/useSoftwareParams'
import {getOrganisationSoftwareOrder} from './filters/OrgSoftwareOrderOptions'

type State = {
  count: number,
  data: SoftwareOfOrganisation[]
}

export default function useOrganisationSoftware() {
  const {token} = useSession()
  const {id,isMaintainer} = useOrganisationContext()
  const {
    search, keywords_json, prog_lang_json, licenses_json,
    categories_json, order, page, rows
  } = useSoftwareParams()

  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getSoftware() {
      if (id) {
        // set loading done
        setLoading(true)

        const orderBy = getOrganisationSoftwareOrder(isMaintainer,order)

        const software: State = await getSoftwareForOrganisation({
          organisation:id,
          searchFor: search ?? undefined,
          keywords: decodeJsonParam(keywords_json,null),
          prog_lang: decodeJsonParam(prog_lang_json,null),
          licenses: decodeJsonParam(licenses_json,null),
          categories: decodeJsonParam(categories_json,null),
          order: orderBy ?? undefined,
          // api works with zero
          page:page ? page-1 : 0,
          rows,
          isMaintainer,
          token
        })
        // abort
        if (abort) return
        // set state
        setState(software)
        // set loading done
        setLoading(false)
      }
    }

    if (id) {
      // debugger
      getSoftware()
    }

    return () => {
      // console.log('useOrganisationSoftware...useEffect...abort')
      abort = true
    }

  }, [
    search, keywords_json, prog_lang_json,
    licenses_json, categories_json, order, page, rows,
    id, token, isMaintainer
  ])

  return {
    software:state.data,
    count:state.count,
    loading
  }
}
