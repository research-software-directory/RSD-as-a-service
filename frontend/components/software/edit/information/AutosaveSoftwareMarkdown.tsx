// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {FocusEventHandler} from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import {useController, useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {softwareInformation as config} from '../editSoftwareConfig'
import {patchSoftwareTable} from './patchSoftwareTable'
import AutosaveRemoteMarkdown from './AutosaveRemoteMarkdown'

type SaveInfo = {
  name: string,
  value: string
}

export default function AutosaveSoftwareMarkdown() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {register, control, resetField, watch, setValue} = useFormContext()
  const {fieldState: {isDirty:dirtyDesc, error: errDescription}} = useController({
    control,
    name: 'description'
  })
  const {fieldState: {error: errDescriptionUrl}} = useController({
    control,
    name: 'description_url'
  })

  const [
    id, description_type, description, description_url
  ] = watch([
    'id','description_type','description','description_url'
  ])

  // console.group('AutosaveSoftwareMarkdown')
  // console.log('id...', id)
  // console.log('description...', description)
  // console.log('description_type...', description_type)
  // console.log('description_url...', description_url)
  // console.log('dirtyDesc...', dirtyDesc)
  // console.log('isValid...', isValid)
  // console.groupEnd()

  function shouldSave({name, value}: SaveInfo) {
    // console.log('shouldSave...', name, value)
    if (name === 'description_type') {
      // when changing type we need to check
      // if the values provided are valid before saving
      if (value === 'link') {
        // when link type description_url field should not contain errors
        if (typeof errDescriptionUrl == 'undefined') return true
      } else {
        // when other types (markdown) description field should not contain errors
        if (typeof errDescription == 'undefined') return true
      }
      // otherwise where are errors
      return false
    }
    // other fields are not validated by this method
    // because they use internal validation (before onSave event is called)
    return true
  }

  async function saveSoftwareInfo({name, value}: SaveInfo) {
    // validate
    const save = shouldSave({name, value})
    // console.log('saveSoftwareInfo...save...',save)
    if ( save === false) return
    // collect data to save
    const data = {
      description_type,
      description_url,
      description
    }
    if (name === 'description' ||
      name === 'description_url' ||
      name === 'description_type'
    ) {
      data[name] = value
    }

    const resp = await patchSoftwareTable({
      id,
      data,
      token
    })

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(name, {
        defaultValue:value
      })
    }
  }

  function saveDescription(e: FocusEventHandler<HTMLTextAreaElement>) {
    // console.log('saveDescription...dirtyDesc...',dirtyDesc)
    // we do not save when error or no change
    if (dirtyDesc===false || errDescription) return
    // cast types
    const target = (e as any).target as HTMLTextAreaElement
    saveSoftwareInfo({
      name: 'description',
      value: target.value
    })
  }

  function renderMarkdownComponents() {
    if (description_type === 'link') {
      return (
        <AutosaveRemoteMarkdown
          options={{
            autofocus: true,
            type: 'url',
            name: 'description_url',
            label: config.description_url.label,
            useNull: true,
            defaultValue: description_url,
            helperTextMessage: config.description_url.help,
            helperTextCnt: `${description_url?.length || 0}/${config.description_url.validation.maxLength.value}`,
          }}
          rules={config.description_url.validation}
          onSaveField={saveSoftwareInfo}
        />
      )
    }
    // custom markdown is default
    return (
      <MarkdownInputWithPreview
        markdown={description || ''}
        register={register('description', {
          maxLength: config.description.validation.maxLength.value
        })}
        disabled={description_type !== 'markdown'}
        helperInfo={{
          length: description?.length ?? 0,
          maxLength: config.description.validation.maxLength.value
        }}
        onBlur={saveDescription}
      />
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.description.label}
        infoLink={config.description.help}
      />
      <RadioGroup
        row
        aria-labelledby="radio-group"
        value={description_type ?? 'markdown'}
        defaultValue={description_type ?? 'markdown'}
        onChange={(e, value) => {
          // update form value
          setValue('description_type', value)
          // save (if needed)
          saveSoftwareInfo({
            name: 'description_type',
            value
          })
        }}
        sx={{
          margin:'0.75rem 0rem'
        }}
      >
        <FormControlLabel
          label="Custom markdown"
          value="markdown"
          defaultValue={'markdown'}
          control={<Radio />}
        />
        <div className="py-2"></div>
        <FormControlLabel
          label="Markdown URL"
          value="link"
          defaultValue={'link'}
          control={<Radio />}
        />
      </RadioGroup>
      {renderMarkdownComponents()}
    </>
  )
}

