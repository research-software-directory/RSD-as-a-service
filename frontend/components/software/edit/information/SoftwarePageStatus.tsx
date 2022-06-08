import EditSectionTitle from '../../../layout/EditSectionTitle'
import ControlledSwitch from '../../../form/ControlledSwitch'


export default function SoftwarePageStatus({control,config,formData}:
  { control:any,config:any, formData:any }) {

  return (
    <>
      <EditSectionTitle
        title={config.pageStatus.title}
        subtitle={config.pageStatus.subtitle}
      />
      <div className="flex">
        <ControlledSwitch
          name='is_published'
          label={config.is_published.label}
          control={control}
          defaultValue={formData.is_published}
        />
      </div>
    </>
  )
}
