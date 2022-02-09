import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import RemoteMarkdownPreview from '../../form/RemoteMarkdownPreview'
import MarkdownInputWithPreview from '../../form/MarkdownInputWithPreview'
import {SoftwareItem} from '../../../types/SoftwareTypes'
import EditSectionTitle from './EditSectionTitle'

export default function SoftwareMarkdown({register,errors,config,formData}: {
  register:any,errors:any,config:any,formData:SoftwareItem
}) {

  function renderMarkdownComponents() {
    if (formData?.description_type === 'link') {
      return (
         <RemoteMarkdownPreview
          url={formData?.description_url ?? ''}
          label={config.description_url.label}
          help={config.description_url.help}
          errors={errors?.description_url}
          register={register('description_url', {
            maxLength: {value: 200, message: 'Maximum length is 200'},
            pattern: {
              value: /^https?:\/\/.+\..+.md$/,
              message: 'Url should start with http(s):// have at least one dot (.) and end with (.md)'
            }
          })}
        />
      )
    }
    // default is custom markdown
    return (
      <>
        <div className="py-4"></div>
        <MarkdownInputWithPreview
          markdown={formData?.description || ''}
          register={register('description')}
          disabled={formData?.description_type !== 'markdown'}
          // autofocus={data.description_type === 'markdown'}
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

