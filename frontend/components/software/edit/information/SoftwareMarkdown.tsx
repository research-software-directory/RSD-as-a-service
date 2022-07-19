// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import ControlledRemoteMarkdown from '../../../form/ControlledRemoteMarkdown'
import MarkdownInputWithPreview from '../../../form/MarkdownInputWithPreview'
import {SoftwareItem} from '../../../../types/SoftwareTypes'
import EditSectionTitle from '../../../layout/EditSectionTitle'
import {SoftwareInformationConfig} from '../editSoftwareConfig'

type SoftwareMarkdownProps = {
  register: any,
  control: any,
  config: SoftwareInformationConfig,
  defaultDescriptionUrl: string | null,
  formData: SoftwareItem
}

export default function SoftwareMarkdown({register, control, config,
  defaultDescriptionUrl, formData}:SoftwareMarkdownProps) {

  function renderMarkdownComponents() {
    if (formData?.description_type === 'link') {
      return (
        <ControlledRemoteMarkdown
          options={{
            autofocus: true,
            name: 'description_url',
            label: config.description_url.label,
            useNull: true,
            defaultValue: defaultDescriptionUrl,
            helperTextMessage: config.description_url.help,
            helperTextCnt: `${formData?.description_url?.length || 0}/${config.description_url.validation.maxLength.value}`,
          }}
          control={control}
          rules={config.description_url.validation}
        />
      )
    }
    // custom markdown is default
    return (
      <>
        <div className="py-4"></div>
        <MarkdownInputWithPreview
          markdown={formData?.description || ''}
          register={register('description', {
            maxLength: config.description.validation.maxLength.value
          })}
          disabled={formData?.description_type !== 'markdown'}
          helperInfo={{
            length: formData?.description?.length ?? 0,
            maxLength: config.description.validation.maxLength.value
          }}
        />
      </>
    )
  }

  return (
    <>
      <EditSectionTitle
        title={config.description.label}
        subtitle={config.description.help(formData?.brand_name ?? '')}
      />

      <RadioGroup
        row
        aria-labelledby="radio-group"
        value={formData?.description_type ?? 'markdown'}
        defaultValue={formData?.description_type ?? 'markdown'}
      >
        <FormControlLabel
          label="Document URL"
          value="link"
          defaultValue={'link'}
          control={<Radio {...register('description_type')} />}
        />
        <div className="py-2"></div>

        <FormControlLabel
          label="Custom markdown"
          value="markdown"
          defaultValue={'markdown'}
          control={<Radio {...register('description_type')}/>}
        />
      </RadioGroup>
      {renderMarkdownComponents()}
    </>
  )
}

