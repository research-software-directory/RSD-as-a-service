// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useMemo,useState} from 'react'

import {useSession} from '~/auth'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {SoftwareOfOrganisation} from '~/types/Organisation'
import {getSoftwareForOrganisation} from '../apiOrganisations'
import useOrganisationContext from '../context/useOrganisationContext'
import useSoftwareParams from './filters/useSoftwareParams'
import {getSoftwareOrderOptions} from './filters/useSoftwareOrderOptions'

type State = {
  count: number,
  data: SoftwareOfOrganisation[]
}

export default function useOrganisationSoftware() {
  const {token} = useSession()
  const {id,isMaintainer} = useOrganisationContext()
  const {search, keywords_json, prog_lang_json, licenses_json, order, page, rows} = useSoftwareParams()
  // we need to memo orderOptions array to avoid useEffect dependency loop
  const orderOptions = useMemo(()=>getSoftwareOrderOptions(isMaintainer),[isMaintainer])

  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  // debugger

  useEffect(() => {
    let abort = false
    let orderBy:string

    async function getSoftware() {
      if (id) {
        // set loding done
        setLoading(true)

        if (order) {
          // extract order direction from definitions
          const orderInfo = orderOptions.find(item=>item.key===order)
          if (orderInfo) orderBy=`${order}.${orderInfo.direction}`
        }

        const projects: State = await getSoftwareForOrganisation({
          organisation:id,
          searchFor: search ?? undefined,
          keywords: decodeJsonParam(keywords_json,null),
          prog_lang: decodeJsonParam(prog_lang_json,null),
          licenses: decodeJsonParam(licenses_json,null),
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
        setState(projects)
        // set loding done
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
    licenses_json, order, page, rows,
    id, token, isMaintainer, orderOptions
  ])

  return {
    software:state.data,
    count:state.count,
    loading
  }
}
