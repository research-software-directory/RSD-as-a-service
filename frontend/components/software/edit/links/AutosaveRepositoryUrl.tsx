// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, JSX} from 'react'
import {useController, useFormContext} from 'react-hook-form'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import {addToRepositoryTable, deleteFromRepositoryTable} from '~/utils/editSoftware'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {CodePlatform, EditSoftwareItem, RepositoryUrl} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import AutosaveRepositoryPlatform from './AutosaveRepositoryPlatform'
import {config} from './config'

async function suggestPlatform(repositoryUrl: string | null) {
  // console.log('repositoryUrl...',repositoryUrl)
  if (repositoryUrl === null) return null

  if (repositoryUrl?.includes('github.')) {
    return 'github'
  }
  if (repositoryUrl?.includes('gitlab.')) {
    return 'gitlab'
  }
  if (repositoryUrl?.includes('bitbucket.')) {
    return 'bitbucket'
  }

  try {
    const repositoryUrlDomain = new URL(repositoryUrl)
    const baseUrl = getBaseUrl()
    const resp = await fetch(
      `${baseUrl}/rpc/suggest_platform`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({hostname: repositoryUrlDomain.host})
      })
    if (resp.status === 200) {
      const platform_type = await resp.json()
      if (platform_type !== null) {
        return platform_type
      }
    }
  } catch (e: any) {
    logger(`suggestPlatform: ${e?.message}`, 'error')
  }
  return 'other'
}

export default function AutosaveRepositoryUrl() {
  const {token, user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control, watch, resetField} = useFormContext<EditSoftwareItem>()
  const {fieldState: {error: urlError}, field: {value: repository_url}} = useController({
    control,
    name: 'repository_url'
  })
  const [id, repository_platform, scraping_disabled_reason] = watch(['id', 'repository_platform', 'scraping_disabled_reason'])
  const [platform, setPlatform] = useState<{
    id: CodePlatform | null
    disabled: boolean
    helperText: string | JSX.Element
  }>({
    id: repository_platform,
    disabled: repository_platform === null,
    helperText: ''
  })
  const [suggestedPlatform, setSuggestedPlatform] = useState<CodePlatform>()

  const options = {
    name: 'repository_url' as keyof EditSoftwareItem,
    label: config.repository_url.label,
    useNull: true,
    defaultValue: repository_url,
    helperTextMessage: config.repository_url.help(repository_url),
    helperTextCnt: `${repository_url?.length || 0}/${config.repository_url.validation.maxLength.value}`,
  }

  // SUGGEST platform based on
  useEffect(() => {
    if (typeof urlError == 'undefined' && repository_url) {
      // Do nothing if the host name is not complete
      if (!/^https?:\/\/\S+\//.test(repository_url)) {
        return
      }
      // debugger
      if (platform.id === null) {
        suggestPlatform(repository_url).then(
          (suggestion) => {
            setSuggestedPlatform(suggestion)
            setPlatform({
              id: suggestion,
              disabled: false,
              helperText: ''
            })
          }
        )
      } else {
        suggestPlatform(repository_url).then(
          (suggestion) => {
            setSuggestedPlatform(suggestion)
            setPlatform({
              id: platform.id,
              disabled: false,
              helperText: suggestion === platform.id ? '' : <span className="text-warning">Are you sure?</span>
            })
          }
        )
      }
    } else if (urlError) {
      // debugger
      setPlatform({
        id: null,
        disabled: true,
        helperText: ''
      })
    }
  }, [urlError, repository_url, platform.id])

  async function saveScrapingDisabledReason({value}: {value: string | null}) {
    try {
      const resp = await fetch(`/api/v1/repository_url?software=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({scraping_disabled_reason: value}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (!resp.ok) {
        showErrorMessage(`Failed to save the disabling reason with status code ${resp.status} and body ${JSON.stringify(resp.body)}`)
      }
    } catch (e) {
      showErrorMessage(`Failed to save the disabling reason with an unknown error: ${e}`)
    }
  }

  async function saveRepositoryInfo({name, value}: OnSaveProps<EditSoftwareItem>) {
    // complete record for upsert
    const data: RepositoryUrl = {
      software: id,
      url: repository_url ?? '',
      code_platform: platform.id ?? 'other',
      // we clean repo stats when url is changed
      license: null,
      star_count: null,
      fork_count: null,
      open_issue_count: null,
      basic_data_last_error: null,
      basic_data_scraped_at: null,
      languages: null,
      languages_last_error: null,
      languages_scraped_at: null,
      commit_history: null,
      commit_history_last_error: null,
      commit_history_scraped_at: null,
      contributor_count: null,
      contributor_count_last_error: null,
      contributor_count_scraped_at: null,
      scraping_disabled_reason: scraping_disabled_reason
    }
    if (name === 'repository_url') {
      data.url = value
    } else if (name === 'repository_platform') {
      // compare to suggested platform
      let helperText: string
      if (suggestedPlatform === value) {
        helperText = ''
      } else {
        helperText = 'Are you sure?'
      }
      // update value
      data.code_platform = value as CodePlatform
      // manually overwriting advice
      setPlatform({
        id: value as CodePlatform,
        disabled: false,
        helperText
      })
    }
    let resp
    if (data.url === null) {
      // console.group('saveRepositoryInfo')
      // console.log('DELETE...', id)
      // console.groupEnd()
      // DELETE entry when url is cleared
      resp = await deleteFromRepositoryTable({software: id, token})
      // remove platform value
      setPlatform({
        id: null,
        disabled: true,
        helperText: ''
      })
    } else {
      // console.group('saveRepositoryInfo')
      // console.log('UPSERT...', data)
      // console.groupEnd()
      // UPSERT
      resp = await addToRepositoryTable({data, token})
    }
    if (resp.status !== 200) {
      showErrorMessage(`Failed to save repository url. ${resp.message}`)
    } else {
      // reset both fields
      resetField('repository_url', {defaultValue: data.url})
      resetField('repository_platform', {defaultValue: data.code_platform})
    }
  }

  // console.group('AutosaveRepositoryUrl')
  // console.log('id...', id)
  // console.log('repository_url...', repository_url)
  // console.log('platform...', platform)
  // console.log('scraping_disabled_reason...', scraping_disabled_reason)
  // console.log('urlError...', urlError)
  // console.log('options...', options)
  // console.groupEnd()

  return (
    <>
      <div className="flex gap-4 items-baseline">
        <AutosaveControlledTextField
          options={options}
          control={control}
          rules={config.repository_url.validation}
          onSaveField={saveRepositoryInfo}
        />
        <AutosaveRepositoryPlatform
          value={platform.id}
          disabled={platform.disabled}
          helperText={platform.helperText}
          onChange={(platform) => saveRepositoryInfo({name: 'repository_platform', value: platform})}
        />
      </div>
      {(user?.role === 'rsd_admin')
        ? <AutosaveControlledTextField
          options={{
            name: 'scraping_disabled_reason',
            label: config.repository_disabled_scraping_reason.label,
            useNull: true,
            defaultValue: scraping_disabled_reason,
            helperTextMessage: config.repository_url.help(repository_url),
            helperTextCnt: `${scraping_disabled_reason?.length || 0}/200`,
            disabled: user?.role !== 'rsd_admin',
          }}
          control={control}
          rules={config.repository_disabled_scraping_reason.validation}
          onSaveField={saveScrapingDisabledReason}
        />
        : null}
    </>
  )
}
