// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {sortOnStrProp} from '~/utils/sortFn'
import {getKeywordsFromDoi} from '~/utils/getInfoFromDatacite'
import {addKeywordsToSoftware, createOrGetKeyword, KeywordItem} from '~/components/keyword/apiEditKeywords'
import {KeywordForSoftware} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {config} from './config'

type ImportKeywordsFromDoiProps = {
  software_id: string
  concept_doi: string | null
  keywords:KeywordForSoftware[]
  onSetKeywords:(items:KeywordForSoftware[])=>void
}

export default function ImportKeywordsFromDoi({software_id, concept_doi, keywords, onSetKeywords}: ImportKeywordsFromDoiProps) {
  const {token} = useSession()
  const [loading, setLoading] = useState(false)
  const {showInfoMessage,showSuccessMessage} = useSnackbar()

  async function importKeywordsFromDoi() {
    const importedKeywords:KeywordForSoftware[] = []
    const failedKeywords:string[] = []
    setLoading(true)
    const keywordsDoi: string[] = await getKeywordsFromDoi(concept_doi)
    if (keywordsDoi && keywordsDoi.length === 0) {
      showInfoMessage(
        `No Keywords could be found for DOI ${concept_doi}`
      )
      setLoading(false)
      return
    }

    for (const kw of keywordsDoi) {
      if (!kw || kw.length === 0) {
        // skip to next item in the loop
        continue
      }
      // is it already added to this software?
      const find = keywords.find(item => item.keyword.trim().toLowerCase() === kw.trim().toLowerCase())
      if (find) {
        // skip to next item in the loop
        continue
      }
      // create new or get reference to existing
      const create = await createOrGetKeyword({
        keyword: kw.trim(),
        token
      })
      if (create.status === 201) {
        const newKeyword: KeywordItem = create.message
        const add = await addKeywordsToSoftware({
          data: {
            software: software_id,
            keyword: newKeyword.id
          },
          token
        })
        // if added properly
        if (add.status === 200) {
          // add to list of imported
          importedKeywords.push({
            id: newKeyword.id,
            keyword: newKeyword.value,
            software: software_id
          })
        } else {
          // add to list of failed
          failedKeywords.push(kw)
        }
      } else {
        // add to list of failed
        failedKeywords.push(kw)
      }
    }
    if (importedKeywords.length > 0) {
      // combine all items and order
      const items = [
        ...keywords,
        ...importedKeywords
      ].sort((a, b) => sortOnStrProp(a, b, 'keyword'))
      // update collection
      onSetKeywords(items)
      showSuccessMessage(`${importedKeywords.length} keywords imported from DOI ${concept_doi}`)
    } else if (failedKeywords.length > 0) {
      showInfoMessage(`Failed to import keywords [${failedKeywords.toString()}] from DOI [${concept_doi}]`)
      // log failure
      logger(`importKeywordsFromDoi: Failed to import keywords [${failedKeywords.toString()}] from DOI [${concept_doi}]`,'warn')
    } else {
      showInfoMessage(`No (additional) keywords imported from DOI ${concept_doi}`)
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
      onClick={importKeywordsFromDoi}
      title={config.importKeywords.message(concept_doi ?? '') ?? ''}
      disabled={concept_doi===null}
    >
      { config.importKeywords.label }
    </Button>
  )
}
