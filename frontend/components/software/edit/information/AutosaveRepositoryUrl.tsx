// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useController, useFormContext} from 'react-hook-form'
import {CodePlatform, EditSoftwareItem, RepositoryUrl} from '~/types/SoftwareTypes'
import {softwareInformation as config} from '../editSoftwareConfig'
import AutosaveRepositoryPlatform from './AutosaveRepositoryPlatform'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {useEffect, useState} from 'react'
import {addToRepositoryTable, deleteFromRepositoryTable} from '~/utils/editSoftware'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'


function suggestPlatform(repositoryUrl: string | null) {
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
  // debugger
  return 'other'
}

export default function AutosaveRepositoryUrl() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control, watch, resetField} = useFormContext<EditSoftwareItem>()
  const {fieldState:{error:urlError},field:{value:repository_url}} = useController({
    control,
    name:'repository_url'
  })
  const [id,repository_platform] = watch(['id','repository_platform'])
  const [platform, setPlatform] = useState<{
    id: CodePlatform | null
    disabled: boolean
    helperText: string
  }>({
    id: repository_platform,
    disabled: repository_platform===null,
    helperText: 'Suggestion'
  })

  const options = {
    name: 'repository_url',
    label: config.repository_url.label,
    useNull: true,
    defaultValue: repository_url,
    helperTextMessage: config.repository_url.help,
    helperTextCnt: `${repository_url?.length || 0}/${config.repository_url.validation.maxLength.value}`,
  }

  // SUGGEST platform based on
  useEffect(() => {
    if (typeof urlError == 'undefined' && repository_url) {
      // debugger
      if (platform.id === null) {
        const suggestedPlatform = suggestPlatform(repository_url)
        // console.log('suggestedPlatform...',suggestedPlatform)
        setPlatform({
          id: suggestedPlatform,
          disabled: false,
          helperText: 'Suggestion'
        })
      }
    } else if (urlError) {
      // debugger
      setPlatform({
        id: null,
        disabled: true,
        helperText: ''
      })
    }
  },[urlError,repository_url,platform.id])

  async function saveRepositoryInfo({name, value}: OnSaveProps) {
    // complete record for upsert
    const data:RepositoryUrl = {
      software: id,
      url: repository_url ?? '',
      code_platform: platform.id ?? 'other',
      // we clean repo stats when url is changed
      languages: null,
      languages_scraped_at: null,
      license: null,
      license_scraped_at: null,
      commit_history: null,
      commit_history_scraped_at: null
    }
    if (name === 'repository_url') {
      data.url = value
    } else if (name === 'repository_platform') {
      // compare to suggested platform
      const suggestedPlatform = suggestPlatform(repository_url)
      let helperText = 'Selected'
      if (suggestedPlatform === value) {
        helperText = 'Suggested'
      } else {
        helperText = 'Are you sure?'
      }
      // update value
      data.code_platform = value as CodePlatform
      // manualy overwriting advice
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
      // DELETE entry when url is clered
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
      resetField('repository_platform',{defaultValue: data.code_platform})
    }
  }

  // console.group('AutosaveRepositoryUrl')
  // console.log('id...', id)
  // console.log('repository_url...', repository_url)
  // console.log('platform...', platform)
  // console.log('urlError...', urlError)
  // console.groupEnd()

  return (
    <div className="flex items-baseline">
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
        onChange={(platform)=>saveRepositoryInfo({name:'repository_platform',value:platform})}
      />
    </div>
  )
}
