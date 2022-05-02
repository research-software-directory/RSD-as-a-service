import {useFormContext} from 'react-hook-form'

import ControlledTextInput from '~/components/form/ControlledTextInput'
import {EditProject} from '~/types/Project'
import {projectInformation as config} from './config'

export default function ProjectPeriod({date_start, date_end}:
  { date_start: string | null, date_end: string | null }) {
  const {control} = useFormContext<EditProject>()

  return (
    <div className="flex">
      <ControlledTextInput
        name="date_start"
        defaultValue={date_start}
        control={control}
        muiProps={{
          autoComplete: 'off',
          variant: 'standard',
          label: config.date_start.label,
          type: 'date',
          InputLabelProps:{
            shrink: true
          }
        }}
      />
      <div className="px-5"></div>
      <ControlledTextInput
        name="date_end"
        defaultValue={date_end}
        control={control}
        muiProps={{
          autoComplete: 'off',
          variant: 'standard',
          label: config.date_end.label,
          type: 'date',
          InputLabelProps:{
            shrink: true
          }
        }}
      />
    </div>
  )
}
