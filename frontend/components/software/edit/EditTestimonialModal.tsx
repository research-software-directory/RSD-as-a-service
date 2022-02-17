import {useEffect,useState, useContext} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import {useForm} from 'react-hook-form'

import snackbarContext from '../../snackbar/PageSnackbarContext'
import {testimonial} from '../../../types/testimonial'
import ControlledTextField from '../../form/ControlledTextField'
import ControlledSwitch from '../../form/ControlledSwitch'
import testimonialAvatar from '../testimonialAvatar'
import {testimonialInformation as config} from './editSoftwareConfig'
import {getDisplayInitials, getDisplayName} from '../../../utils/getDisplayName'
import logger from '../../../utils/logger'
import {Testimonial} from '../../../types/Testimonial'

type EditTestimonialModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: testimonial, pos?: number }) => void,
  testimonial?: Testimonial,
  pos?: number
}

export default function EditTestimonialModal({open, onCancel, onSubmit, testimonial, pos}: EditTestimonialModalProps) {
  const {options: snackbarOptions, setSnackbar} = useContext(snackbarContext)
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [b64Image, setB64Image]=useState<string>()
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<testimonial>({
    mode: 'onChange',
    defaultValues: {
      ...testimonial
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  // console.group('EditTestimonialModal')
  // console.log('open...', open)
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('smallScreen...', smallScreen)
  // console.log('testimonial...', testimonial)
  // console.log('formData...', formData)
  // console.groupEnd()

  useEffect(() => {
    if (testimonial) {
      reset(testimonial)
    }
  }, [testimonial,reset])

  function handleCancel() {
    // reset form
    reset()
    // remove image upload
    setB64Image(undefined)
    // hide
    onCancel()
  }

  return (
     <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        testimonial
      </DialogTitle>
      <form onSubmit={handleSubmit((data: testimonial) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('software')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
        }}>
          <section className="grid grid-cols-[1fr,2fr] gap-8">
            <ControlledTextField
              control={control}
              options={{
                name: 'text',
                multiline: true,
                label: config.text.label,
                useNull: true,
                defaultValue: testimonial?.text,
                helperTextMessage: config.text.help,
                helperTextCnt: `${formData?.text?.length || 0}/${config.text.validation.maxLength.value}`,
              }}
              rules={config.text.validation}
            />
            <div className="py-4"></div>
            <ControlledTextField
              control={control}
              options={{
                name: 'person',
                label: config.person.label,
                useNull: true,
                defaultValue: testimonial?.person,
                helperTextMessage: config.person.help,
                helperTextCnt: `${formData?.person?.length || 0}/${config.person.validation.maxLength.value}`,
              }}
              rules={config.person.validation}
            />
          <div className="py-4"></div>
          <section className="py-4 grid grid-cols-[1fr,1fr] gap-8">
            <ControlledTextField
              control={control}
              options={{
                name: 'email_address',
                label: config.email_address.label,
                type: 'email',
                useNull: true,
                defaultValue: testimonial?.email_address,
                helperTextMessage: config.email_address.help,
                // helperTextCnt: `${formData?.email_address?.length || 0}/${config.email_address.validation.maxLength.value}`,
              }}
              rules={config.email_address.validation}
            />

            <ControlledTextField
                options={{
                  name: 'orcid',
                  label: config.orcid.label,
                  useNull: true,
                  defaultValue: testimonial?.orcid,
                  helperTextMessage: config.orcid.help,
                  // helperTextCnt: `${formData?.orcid?.length || 0}/${config.orcid.validation.maxLength.value}`,
                }}
                control={control}
                rules={config.orcid.validation}
              />

            <ControlledTextField
              control={control}
              options={{
                name: 'role',
                label: config.role.label,
                useNull: true,
                defaultValue: testimonial?.role,
                helperTextMessage: config.role.help,
                // helperTextCnt: `${formData?.role?.length || 0}/${config.role.validation.maxLength.value}`,
              }}
              rules={config.role.validation}
            />

            <ControlledTextField
              control={control}
              options={{
                name: 'affiliation',
                label: config.affiliation.label,
                useNull: true,
                defaultValue: testimonial?.affiliation,
                helperTextMessage: config.affiliation.help,
                // helperTextCnt: `${formData?.affiliation?.length || 0}/${config.affiliation.validation.maxLength.value}`,
              }}
              rules={config.affiliation.validation}
            />

          </section>
          <section>
            <ControlledSwitch
              name="is_contact_person"
              label="Contact person"
              control={control}
              defaultValue={testimonial?.is_contact_person ?? false}
            />
          </section>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            tabIndex={1}
            onClick={handleCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <Button
            tabIndex={0}
            type="submit"
            variant="contained"
            sx={{
              // overwrite tailwind preflight.css for submit type
              '&[type="submit"]:not(.Mui-disabled)': {
                backgroundColor:'primary.main'
              }
            }}
            endIcon={
              <SaveIcon />
            }
            disabled={isSaveDisabled()}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSaveDisabled() {
    // if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
