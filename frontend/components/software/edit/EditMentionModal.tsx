import {useEffect} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import ControlledTextField from '../../form/ControlledTextField'
import {mentionInformation as config} from './editSoftwareConfig'
import {MentionItem} from '../../../types/MentionType'

type EditMentionModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: MentionItem, pos?: number }) => void,
  mention?: MentionItem,
  // item position in the array
  pos?: number
}

export default function EditMentionModal({open, onCancel, onSubmit, mention, pos}: EditMentionModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register, setValue} = useForm<MentionItem>({
    mode: 'onChange',
    defaultValues: {
      ...mention
    }
  })

  // extract
  const {isValid, isDirty} = formState
  const formData = watch()

  // console.group('EditMentionModal')
  // console.log('open...', open)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('smallScreen...', smallScreen)
  // console.log('testimonial...', testimonial)
  // console.log('formData...', formData)
  // console.groupEnd()

  useEffect(() => {
    if (mention) {
      reset(mention)
    }
  }, [mention,reset])

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
      <form onSubmit={handleSubmit((data: MentionItem) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'title',
              // variant: 'outlined',
              // multiline: true,
              // rows: 4,
              label: config.title.label,
              useNull: true,
              defaultValue: mention?.title,
              helperTextMessage: config.title.help,
              // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
            }}
            rules={config.title.validation}
          />
          <div className="py-4"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'author',
              // variant: 'outlined',
              label: config.author.label,
              useNull: true,
              defaultValue: mention?.author,
              helperTextMessage: config.author.help,
              // helperTextCnt: `${formData?.source?.length || 0}/${config.source.validation.maxLength.value}`,
            }}
            rules={config.author.validation}
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
