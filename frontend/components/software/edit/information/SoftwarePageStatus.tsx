import EditSectionTitle from '../EditSectionTitle'
import ControlledSwitch from '../../../form/ControlledSwitch'


export default function SoftwarePageStatus({control,config,formData}:
  { control:any,config:any, formData:any }) {

  return (
    <>
      <EditSectionTitle
        title="Page status"
        subtitle="Featured pages are listed first."
      />
      <div className="flex">
        <ControlledSwitch
          name='is_published'
          label={config.is_published.label}
          control={control}
          defaultValue={formData.is_published}
        />

        <ControlledSwitch
          name='is_featured'
          label={config.is_featured.label}
          control={control}
          defaultValue={formData.is_featured}
        />
      </div>
    </>
  )
}
