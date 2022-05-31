import {useEffect} from 'react'
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import {useForm} from 'react-hook-form'

import ControlledTextField from '../form/ControlledTextField'
import ControlledSwitch from '../form/ControlledSwitch'
import {mentionModal as config, mentionType} from './config'
import {MentionItemProps, MentionTypeKeys} from '../../types/Mention'
import ControlledSelect from '~/components/form/ControlledSelect'

export type EditMentionModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: MentionItemProps, pos?: number }) => void,
  item?: MentionItemProps,
  // item position in the array
  pos?: number
  title?: string
}

const mentionTypeOptions = Object.keys(mentionType).map(key => {
  const type = mentionType[key as MentionTypeKeys].singular
  return {
    value: key,
    label: type
  }
})

export default function EditMentionModal({open, onCancel, onSubmit, item, pos, title}: EditMentionModalProps) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {handleSubmit, watch, formState, reset, control, register} = useForm<MentionItemProps>({
    mode: 'onChange',
    defaultValues: {
      ...item
    }
  })
  // extract form states
  const {isValid, isDirty, errors} = formState
  const formData = watch()

  // console.group('EditMentionModal')
  // console.log('item...', item)
  // console.log('formData...', formData)
  // console.groupEnd()

  useEffect(() => {
    if (item) {
      //(re)set form to item values
      reset(item)
    }
  }, [item,reset])

  function handleCancel(event: any, reason: 'backdropClick' | 'escapeKeyDown') {
    if (reason === 'backdropClick') {
      // we do not cancel on backdrop click
      // only on escape or using cancel button
      return false
    }
    // reset form to empty
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
      maxWidth="md"
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {title ? title : 'Mention'}
      </DialogTitle>
      <form onSubmit={handleSubmit((data: MentionItemProps) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('source')}
        />
        <DialogContent
          sx={{
            width: ['100%'],
            padding: '1rem 1.5rem 2.5rem'
          }}>
          <ControlledTextField
            control={control}
            options={{
              name: 'title',
              label: config.title.label,
              autofocus: true,
              useNull: true,
              defaultValue: formData?.title,
              helperTextMessage: config.title.help,
              helperTextCnt: `${formData?.title?.length || 0}/${config.title.validation.maxLength.value}`,
            }}
            rules={config.title.validation}
          />
          <div className="py-2"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'authors',
              label: config.authors.label,
              useNull: true,
              defaultValue: formData?.authors,
              helperTextMessage: config.authors.help,
              helperTextCnt: `${formData?.authors?.length || 0}/${config.authors.validation.maxLength.value}`,
            }}
            rules={config.authors.validation}
          />
          <div className="grid grid-cols-[2fr,1fr] gap-4 py-4">
            <ControlledTextField
              control={control}
              options={{
                name: 'publisher',
                label: config.publisher.label,
                useNull: true,
                defaultValue: formData?.publisher,
                helperTextMessage: config.publisher.help,
                // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
              }}
              rules={config.publication_year.validation}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'page',
                label: config.page.label,
                useNull: true,
                defaultValue: formData?.page ?? null,
                helperTextMessage: config.page.help,
                // helperTextCnt: `${formData?.message?.length || 0}/${config.message.validation.maxLength.value}`,
              }}
              rules={config.publication_year.validation}
            />
          </div>
          <div className="grid grid-cols-[2fr,1fr] gap-4 py-4">
            <ControlledSelect
              name="mention_type"
              label={config.mentionType.label}
              control={control}
              options={mentionTypeOptions}
              rules={config.mentionType.validation}
              defaultValue={formData?.mention_type ?? null}
              disabled={false}
              helperTextMessage={config.mentionType.help}
            />
            <ControlledTextField
              control={control}
              options={{
                name: 'publication_year',
                type: 'number',
                label: config.publication_year.label,
                useNull: true,
                defaultValue: formData?.publication_year ?? null,
                helperTextMessage: config.publication_year.help
              }}
              rules={config.publication_year.validation}
            />
          </div>
          <ControlledTextField
            control={control}
            options={{
              name: 'url',
              label: config.url.label,
              useNull: true,
              defaultValue: formData?.url,
              helperTextMessage: config.url.help,
              helperTextCnt: `${formData?.url?.length || 0}/${config.url.validation.maxLength.value}`,
            }}
            rules={config.url.validation}
          />
          <div className="py-2"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'image_url',
              label: config.image_url.label,
              useNull: true,
              defaultValue: formData?.image_url,
              helperTextMessage: config.image_url.help,
              helperTextCnt: `${formData?.image_url?.length || 0}/${config.image_url.validation.maxLength.value}`,
            }}
            rules={config.image_url.validation}
          />
          <section className="flex pt-4 justify-between">
            <ControlledSwitch
              name="is_featured"
              label={config.is_featured.label}
              control={control}
              defaultValue={formData?.is_featured ?? false}
              disabled={isFeaturedDisabled()}
            />
            {/* not practical to show quite small image?!?
            <div className="px-2"></div>
            {
              formData?.is_featured ?
                <Avatar
                  alt={formData?.title ?? 'Image'}
                  src={formData?.image_url ?? ''}
                  variant="square"
                  sx={{
                    height:'4rem'
                  }}
                />
                : null
            } */}
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

  function isFeaturedDisabled() {
    if (errors?.image_url || errors?.url) return true
    if (formData.url && formData.image_url) return false
    return true
  }
}
