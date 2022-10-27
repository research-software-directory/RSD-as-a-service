// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'

import {softwareInformation as config} from '../editSoftwareConfig'
import {KeywordForSoftware} from '~/types/SoftwareTypes'
import {useState} from 'react'
import {getKeywordsFromDoi} from '~/utils/getInfoFromDatacite'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {searchForSoftwareKeywordExact} from './searchForSoftwareKeyword'
import {addKeywordsToSoftware, createKeyword} from '~/utils/editKeywords'
import {useSession} from '~/auth'
import {sortOnStrProp} from '~/utils/sortFn'
import {Keyword} from '~/components/keyword/FindKeyword'
import logger from '~/utils/logger'

type ImportKeywordsFromDoiProps = {
  software_id: string
  concept_doi: string
  keywords:KeywordForSoftware[]
  onSetKeywords:(items:KeywordForSoftware[])=>void
}

export default function ImportKeywordsFromDoi({software_id, concept_doi, keywords, onSetKeywords}: ImportKeywordsFromDoiProps) {
  const {token} = useSession()
  const [loading, setLoading] = useState(false)
  const {showInfoMessage,showSuccessMessage} = useSnackbar()

  async function addKeyword(selected: Keyword) {
    const resp = await addKeywordsToSoftware({
      data:{software:software_id, keyword: selected.id},
      token
    })
    return {
      ...resp,
      keyword: {
        ...selected,
        software: software_id
      }
    }
  }

  async function createAndAdd(selected: string) {
    // create keyword
    const resp = await createKeyword({
      keyword: selected,
      token
    })
    if (resp.status === 201) {
      const keyword = {
        id: resp.message as string,
        keyword: selected,
        cnt: null
      }
      // add keyword after created
      return addKeyword(keyword)
    } else {
      return {
        ...resp,
        keyword: null
      }
    }
  }

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
      const find = keywords.filter(item => item.keyword.trim().toLowerCase() === kw.trim().toLowerCase())
      if (find.length > 0) {
        // skip to next item in the loop
        continue
      }
      // is it already in RSD?
      const findDb = await searchForSoftwareKeywordExact({searchFor: kw.trim()})
      if (findDb.length === 1) {
        const {status, keyword} = await addKeyword(findDb[0])
        if (status === 200) {
          importedKeywords.push(keyword)
        } else {
          failedKeywords.push(kw)
        }
      } else {
        // create new keyword
        const {status, keyword} = await createAndAdd(kw)
        if (status === 200 && keyword!==null) {
          importedKeywords.push(keyword)
        } else {
          failedKeywords.push(kw)
        }
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
    } else {
      showInfoMessage(`No (additional) keywords imported from DOI ${concept_doi}`)
    }
    // we only log failed for now
    if (failedKeywords.length > 0) {
      logger(`Failed to import keywords [${failedKeywords.toString()}] from DOI [${concept_doi}]`,'warn')
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
      startIcon={renderStartIcon()}
      onClick={importKeywordsFromDoi}
      title={config.importKeywords.message(concept_doi) ?? ''}
    >
      { config.importKeywords.label }
    </Button>
  )
}
