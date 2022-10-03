// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import MarkdownInputWithPreview from '../../../form/MarkdownInputWithPreview'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {softwareInformation as config} from '../editSoftwareConfig'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useController, useFormContext} from 'react-hook-form'
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
  const {field: {value: description}, fieldState: {error: errDescription}} = useController({
    control,
    name: 'description'
  })
  const {field: {value: description_url}, fieldState: {error: errDescriptionUrl}} = useController({
    control,
    name: 'description_url'
  })

  const [
    id, brand_name, description_type
  ] = watch([
    'id','brand_name', 'description_type'
  ])

  // console.group('AutosaveSoftwareMarkdown')
  // console.log('id...', id)
  // console.log('description...', description)
  // console.log('description_type...', description_type)
  // console.log('description_url...', description_url)
  // console.log('dirtyFields...', dirtyFields)
  // console.log('isValid...', isValid)
  // console.groupEnd()

  function shouldSave({name, value}: SaveInfo) {
    if (name === 'description_type') {
      // when changing type we need to check
      // if the values provided are valid before saving
      if (value === 'link') {
        // when link type description_url field should not container errors
        if (typeof errDescriptionUrl == 'undefined') return true
      } else {
        // when other types (markdown) description field should not container errors
        if (typeof errDescription == 'undefined') return true
      }
      // otherwise where are errors
      return false
    }
    // other fields are not additinally validated by this method
    // because they use internal validation (before onSave event is called)
    return true
  }

  async function saveSoftwareInfo({name, value}: SaveInfo) {
    // validate
    if (shouldSave({name, value}) === false) return
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

    // console.group('AutosaveSoftwareMarkdown.saveSoftwareInfo')
    // console.log('saved...', name)
    // console.log('data...', data)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(name, {
        defaultValue:value
      })
    }
  }

  function renderMarkdownComponents() {
    if (description_type === 'link') {
      return (
        <AutosaveRemoteMarkdown
          options={{
            autofocus: true,
            name: 'description_url',
            label: config.description_url.label,
            useNull: true,
            defaultValue: description_url,
            helperTextMessage: config.description_url.help,
            helperTextCnt: `${description_url?.length || 0}/${config.description_url.validation.maxLength.value}`,
          }}
          control={control}
          rules={config.repository_url.validation}
          onSaveField={saveSoftwareInfo}
        />
      )
    }
    // custom markdown is default
    return (
      <>
        <div className="py-4"></div>
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
          onBlur={(e) => {
            // cast types
            const target = (e as any).target as HTMLTextAreaElement
            saveSoftwareInfo({
              name: 'description',
              value: target.value
            })
          }}
        />
      </>
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.description.label}
        subtitle={config.description.help(brand_name ?? '')}
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
      >
        <FormControlLabel
          label="Document URL"
          value="link"
          defaultValue={'link'}
          control={<Radio />}
        />
        <div className="py-2"></div>

        <FormControlLabel
          label="Custom markdown"
          value="markdown"
          defaultValue={'markdown'}
          control={<Radio />}
        />
      </RadioGroup>
      {renderMarkdownComponents()}
    </>
  )
}

