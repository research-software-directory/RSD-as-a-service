import {useEffect} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import ControlledTextField from '../../../form/ControlledTextField'
import {testimonialInformation as config} from '../editSoftwareConfig'
import {Testimonial} from '../../../../types/Testimonial'

type EditTestimonialModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: Testimonial, pos?: number }) => void,
  testimonial?: Testimonial,
  // item position in the array
  pos?: number
}

export default function EditTestimonialModal({open, onCancel, onSubmit, testimonial, pos}: EditTestimonialModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<Testimonial>({
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
        Testimonial
      </DialogTitle>
      <form onSubmit={handleSubmit((data: Testimonial) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('software')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'message',
              variant: 'outlined',
              multiline: true,
              rows: 4,
              label: config.message.label,
              useNull: true,
              defaultValue: testimonial?.message,
              helperTextMessage: config.message.help,
              helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
            }}
            rules={config.message.validation}
          />
          <div className="py-4"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'source',
              // variant: 'outlined',
              label: config.source.label,
              useNull: true,
              defaultValue: testimonial?.source,
              helperTextMessage: config.source.help,
              helperTextCnt: `${formData?.source?.length || 0}/${config.source.validation.maxLength.value}`,
            }}
            rules={config.source.validation}
          />
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
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
