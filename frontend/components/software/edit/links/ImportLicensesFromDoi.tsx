// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'

import {useSession} from '~/auth/AuthProvider'
import {License} from '~/types/SoftwareTypes'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import logger from '~/utils/logger'
import {sortOnStrProp} from '~/utils/sortFn'
import {getLicensesFromDoi} from '~/utils/getInfoFromDatacite'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {addLicensesForSoftware} from '~/components/software/edit/apiEditSoftware'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {config} from './config'

type ImportLicensesFromDoiProps = {
  concept_doi: string | null
  items: AutocompleteOption<License>[]
  onSetLicenses: (items: AutocompleteOption<License>[])=>void
}

export default function ImportLicensesFromDoi({
  concept_doi, items, onSetLicenses}: ImportLicensesFromDoiProps) {
  const {token} = useSession()
  const {software:{id}} = useSoftwareContext()
  const {showSuccessMessage, showInfoMessage} = useSnackbar()
  const {options:allOptions} = useSpdxLicenses({software:id ?? ''})
  const [loading, setLoading] = useState(false)

  async function addLicense(selected:AutocompleteOption<License>) {
    const license={
      software: id ?? '',
      license: selected.key,
      name: selected.label,
      reference: selected.data.reference,
      open_source: selected.data.open_source
    }
    const resp = await addLicensesForSoftware({
      license,
      token
    })
    if (resp.status === 201) {
      // add entry id
      selected.data.id = resp.message
      selected.data.software = id ?? ''
      return {
        status: 201,
        message: selected
      }
    } else {
      return resp
    }
  }

  async function createLicense({key,name,reference}:{key:string|null,name:string,reference:string|null}) {
    const license = {
      key: key ? key : getSlugFromString(name),
      label: name ?? key,
      data: {
        software: id ?? '',
        license: key ? key : getSlugFromString(name),
        name,
        reference,
        open_source: true
      }
    }
    return addLicense(license)
  }

  async function importLicensesFromDoi() {
    const importedLicenses = []
    const failedLicenses:string[] = []
    setLoading(true)
    // fetch licenses from DOI
    const licenses = await getLicensesFromDoi(concept_doi)
    // find licenses SPDX keys that match items in the options
    for (const license of licenses) {
      // find license by identifier
      let spdx = allOptions.find(item => item.key.toLowerCase() === license.key?.toLowerCase())
      if (typeof spdx == 'undefined') {
        // if not found by identifier try to find it by name
        spdx = allOptions.find(item => item.data.name.toLowerCase() === license.name?.toLowerCase())
      }
      let find
      if (typeof spdx !== 'undefined') {
        // exclude if already in fields based on spdx key
        find = items.find(item => item.key.toLowerCase() === spdx?.key.toLowerCase())
      } else {
        // exclude if already in fields based on key
        find = items.find(item => item.key.toLowerCase() === license.key?.toLowerCase())
        if (typeof find == 'undefined') {
          // try to match on label
          find = items.find(item => item?.label?.toLowerCase() === license.name?.toLowerCase())
        }
      }
      if (find) {
        // go to next license this one is already processed
        continue
      }
      // add to collection
      let resp
      if (spdx) {
        // add existing spdx license
        resp = await addLicense(spdx)
      } else {
        resp = await createLicense({
          key: license.key,
          name: license.name,
          reference: license.reference
        })
      }
      if (resp.status === 201) {
        // created item is in the message
        importedLicenses.push(resp.message)
      } else {
        failedLicenses.push(license.name ?? license.key)
      }
    }
    if (importedLicenses.length > 0) {
      // combine all items and order
      const newList = [
        ...items,
        ...importedLicenses
      ].sort((a, b) => sortOnStrProp(a, b, 'key'))
      // update collection
      onSetLicenses(newList)
      // message
      if (importedLicenses.length === 1) {
        showSuccessMessage(`${importedLicenses.length} license imported from DOI ${concept_doi}`)
      } else if (importedLicenses.length > 1) {
        showSuccessMessage(`${importedLicenses.length} licenses imported from DOI ${concept_doi}`)
      }
    } else {
      showInfoMessage(`No (additional) license to import from DOI ${concept_doi}`)
    }
    // we only log failed for now
    if (failedLicenses.length > 0) {
      logger(`Failed to import licenses [${failedLicenses.toString()}] from DOI [${concept_doi}]`,'warn')
    }
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
      onClick={importLicensesFromDoi}
      title={config.importLicenses.message(concept_doi ?? '')}
      disabled={concept_doi===null}
    >
      { config.importLicenses.label }
    </Button>
  )
}
