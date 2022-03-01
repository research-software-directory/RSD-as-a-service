import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import ControlledRemoteMarkdown from '../../../form/ControlledRemoteMarkdown'
import MarkdownInputWithPreview from '../../../form/MarkdownInputWithPreview'
import {SoftwareItem} from '../../../../types/SoftwareTypes'
import EditSectionTitle from '../EditSectionTitle'
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
          register={register('description')}
          disabled={formData?.description_type !== 'markdown'}
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
          label="Document url"
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

