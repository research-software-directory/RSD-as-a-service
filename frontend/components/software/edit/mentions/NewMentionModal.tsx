import {useEffect} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import ControlledTextField from '../../../form/ControlledTextField'
import ControlledDropdown from '../../../form/ControlledDropdown'
import ControlledSwitch from '../../../form/ControlledSwitch'
import {mentionInformation as config} from '../editSoftwareConfig'
import {MentionItem, mentionType,MentionType} from '../../../../types/MentionType'

type EditMentionModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: MentionItem, pos?: number }) => void,
  mention?: MentionItem,
  // item position in the array
  pos?: number
}

const mentionTypeOptions = Object.keys(mentionType).map(key => {
  const type = mentionType[key as MentionType]
  return {
    key: key,
    label: type,
    data: {
      [`${key}`]: type
    }
  }
})

export default function NewMentionModal({open, onCancel, onSubmit, mention, pos}: EditMentionModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register} = useForm<MentionItem>({
    mode: 'onChange',
    defaultValues: {
      ...mention
    }
  })

  // extract
  const {isValid, isDirty, errors} = formState
  const formData = watch()

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
        Mention
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
          <div className="grid grid-cols-2 gap-4">
            <ControlledDropdown
              name="type"
              label={config.mentionType.label}
              control={control}
              options={mentionTypeOptions}
              rules={config.mentionType.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'date',
                type: 'date',
                label: config.date.label,
                useNull: true,
                defaultValue: mention?.date ?? new Date().toISOString().split('T')[0],
                helperTextMessage: config.date.help,
                // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
              }}
              rules={config.date.validation}
            />
          </div>

          <ControlledTextField
            control={control}
            options={{
              name: 'title',
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
              label: config.author.label,
              useNull: true,
              defaultValue: mention?.author,
              helperTextMessage: config.author.help
            }}
            rules={config.author.validation}
          />
          <div className="py-4"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: config.url.label,
              useNull: true,
              defaultValue: mention?.url,
              helperTextMessage: config.url.help
            }}
            rules={config.url.validation}
          />
          <div className="py-4"></div>
          <section className="flex">
            <ControlledSwitch
              name="is_featured"
              label={config.is_featured.label}
              control={control}
              defaultValue={mention?.is_featured ?? false}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'image',
                label: config.image_url.label,
                useNull: true,
                defaultValue: mention?.image,
                helperTextMessage: config.image_url.help,
              }}
              rules={config.image_url.validation}
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
    if (isValid === false) return true
    if (isDirty === false) return true
    return false
  }
}
