// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback, useEffect, useState} from 'react'

import {colForCreate, EditOrganisation} from '~/types/Organisation'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {upsertImage} from '~/utils/editImage'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createOrganisation, deleteOrganisation} from '~/components/organisation/apiEditOrganisation'
import {getOrganisations, OrganisationAdminProps, RemoveOrganisationProps} from './apiOrganisation'

export function useOrganisations(token: string) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {searchFor, page, rows, count, setCount} = usePaginationWithSearch('Find organisation by name, website or ror_id')
  const [organisations, setOrganisations] = useState<OrganisationAdminProps[]>([])
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
    if (resp.status === 200) {
      showSuccessMessage('Organisation deleted from RSD!')
      // reload organisations
      loadOrganisations()
    }else{
      showErrorMessage(`Failed to remove organisation. ${resp.message}`)
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
