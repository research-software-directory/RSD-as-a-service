// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createOrganisation, deleteOrganisation} from '~/utils/editOrganisation'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import logger from '~/utils/logger'
import {colForCreate, EditOrganisation, OrganisationList} from '~/types/Organisation'
import {upsertImage} from '~/utils/editImage'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {getPropsFromObject} from '~/utils/getPropsFromObject'

export type RemoveOrganisationProps = {
  uuid: string,
  logo_id: string | null
}

type getOrganisationApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: string
}

async function getOrganisations({page, rows, token, searchFor, orderBy}: getOrganisationApiParams) {
  try {
    // NOTE 1! selectList need to include all colums used in filtering
    // NOTE 2! ensure selectList uses identical props as defined in OrganisationList type
    const selectList = 'id,parent,name,website,is_tenant,rsd_path,logo_id,ror_id,software_cnt,project_cnt'
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(name.ilike.*${searchFor}*,website.ilike.*${searchFor}*,ror_id.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=name.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/organisations_overview?select=${selectList}&parent=is.null?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const organisations: OrganisationList[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        organisations
      }
    }
    logger(`getOrganisations: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      organisations: []
    }
  } catch {
    return {
      count: 0,
      organisations: []
    }
  }
}


export function useOrganisations(token: string) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, count, setCount} = usePaginationWithSearch('Find organisation by name, website or ror_id')
  const [organisations, setOrganisations] = useState<OrganisationList[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrganisations = useCallback(async() => {
    // setLoading(true)
    const {organisations, count} = await getOrganisations({
      token,
      searchFor,
      page,
      rows
    })
    setOrganisations(organisations)
    setCount(count ?? 0)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows])

  useEffect(() => {
    if (token) {
      loadOrganisations()
    }
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,searchFor,page,rows])


  async function addOrganisation(data: EditOrganisation) {
    try {
      // UPLOAD LOGO
      if (data.logo_b64 && data.logo_mime_type) {
        // split base64 to use only encoded content
        const b64data = data.logo_b64.split(',')[1]
        const upload = await upsertImage({
          data: b64data,
          mime_type: data.logo_mime_type,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update data values
          data.logo_id = upload.message
          // remove image strings after upload
          data.logo_b64 = null
          data.logo_mime_type = null
        } else {
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return
        }
      }

      // create slug for new organisation based on name
      data.slug = getSlugFromString(data.name)
      // extract props we need for createOrganisation
      const organisation = getPropsFromObject(data, colForCreate)
      // create new organisation
      const {status,message} = await createOrganisation({
        organisation,
        token
      })
      // debugger
      if (status === 201) {
        // reload organisations
        loadOrganisations()
        showSuccessMessage(`Added organisation ${data.name}`)
      } else {
        showErrorMessage(message)
      }
    } catch (e:any) {
      showErrorMessage(`Failed to add organisation. ${e.message}`)
    }
  }


  async function removeOrganisation(props:RemoveOrganisationProps) {
    const resp = await deleteOrganisation({
      ...props,
      token
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to remove organisation. ${resp.message}`)
    }else{
      showSuccessMessage('Organisation deleted from RSD!')
      // reload organisations
      loadOrganisations()
    }
  }

  return {
    organisations,
    loading,
    count,
    page,
    addOrganisation,
    removeOrganisation
  }
}
