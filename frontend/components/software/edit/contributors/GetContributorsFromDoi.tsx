// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import {useSession} from '~/auth/AuthProvider'
import {getContributorsFromDoi} from '~/utils/getInfoFromDatacite'
import {itemsNotInListByKeys} from '~/utils/itemsNotInReferenceList'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {getDisplayName} from '~/utils/getDisplayName'
import {Contributor, ContributorProps} from '~/types/Contributor'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {contributorInformation as config} from '../editSoftwareConfig'
import useSoftwareContext from '../context/useSoftwareContext'
import {postContributor} from './apiContributors'

type GetContributorsFromDoiProps = {
  contributors: Contributor[]
  onSetContributors:(items:Contributor[])=>void
}

export default function GetContributorsFromDoi({contributors,onSetContributors}: GetContributorsFromDoiProps) {
  const {token} = useSession()
  const {showErrorMessage,showInfoMessage} = useSnackbar()
  const [loading, setLoading] = useState(false)
  const {software} = useSoftwareContext()

  async function onImportContributorsFromDoi() {
    setLoading(true)

    const doiContributors: Contributor[] = await getContributorsFromDoi(
      software?.id ?? '', software?.concept_doi ?? ''
    )

    if (!doiContributors || doiContributors.length === 0) {
      showErrorMessage(
        `Contributors could not be added from DOI ${software?.concept_doi}`
      )
      setLoading(false)
      return
    }

    // extract only new Contributors
    // for now using combination of family names and given names
    const newDoiContributors = itemsNotInListByKeys({
      list: doiContributors,
      referenceList: contributors,
      keys: ['family_names','given_names']
    })

    if (newDoiContributors.length === 0) {
      showInfoMessage(
        `No new contributors to add from DOI ${software?.concept_doi} based on {family_names + given_names}.`
      )
      setLoading(false)
      return
    }

    let pos = 0
    const newContributors:Contributor[]=[]
    for (const c of newDoiContributors) {
      // prepare data
      const contributor = getPropsFromObject(c, ContributorProps)
      pos+=1
      contributor.position = contributors.length + pos
      // add contributor to db
      const resp = await postContributor({contributor, token})
      if (resp.status === 201) {
        // update item in newContributors
        contributor.id = resp.message
        // no image provided by datacite
        contributor.avatar_data = null
        contributor.avatar_url = null
        // add to new contributors collection
        newContributors.push(contributor)
      } else {
        showErrorMessage(
          `Failed to add ${getDisplayName(contributor)}. Error: ${resp.message}`
        )
      }
    }

    const list = [
      ...contributors,
      ...newContributors
    ]
    // pass new complete list
    onSetContributors(list)
    // stop loading
    setLoading(false)
  }

  function renderStartIcon() {
    if (loading) {
      return <CircularProgress data-testid="circular-loader" color="inherit" size={20} />
    }
    return <DownloadIcon />
  }

  return (
    <Button
      variant='contained'
      startIcon={renderStartIcon()}
      onClick={onImportContributorsFromDoi}
      title={config.importContributors.message(software?.concept_doi ?? '')}
      sx={{
        marginTop: '1rem'
      }}
      disabled={!software?.concept_doi}
    >
      { config.importContributors.label }
    </Button>
  )
}
