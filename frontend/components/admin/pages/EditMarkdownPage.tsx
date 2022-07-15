import Button from '@mui/material/Button'
import {useCallback, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Session} from '~/auth'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import ContentLoader from '~/components/layout/ContentLoader'
import config from './config'
import {MarkdownPage, useMarkdownPage} from './useMarkdownPages'
import SaveIcon from '@mui/icons-material/Save'
import {saveMarkdownPage} from './saveMarkdownPage'
import useSnackbar from '~/components/snackbar/useSnackbar'

export default function EditMarkdownPage({page, token}: {page: MarkdownPage, token: string }) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {
    register, handleSubmit, watch, formState, reset, control
  } = useForm<MarkdownPage>({
    mode: 'onChange',
    defaultValues: {
      ...page
    }
  })

  // destructure formState
  const {isDirty, isValid} = formState
  // form data provided by react-hook-form
  const formData = watch()

  // console.group('EditMarkdownPage')
  // console.log('page.slug...', page?.slug)
  // console.log('form.slug', formData?.slug)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (abort === false &&
      formData.slug !== page.slug) {
      // debugger
      reset(page)
    }
    return ()=>{abort=true}
  },[page,formData.slug,reset])

  async function onSubmit(data: MarkdownPage) {
    // console.log('Submit...', data)
    const resp = await saveMarkdownPage({
      page:data,
      token
    })
    if (resp.status == 200) {
      showSuccessMessage(`${data.title} page saved`)
      // reset form status after save
      reset(data)
    } else {
      showErrorMessage(`Failed to save ${data.title}. ${resp.message}`)
    }
  }

  return (
    <form
      id={page.slug}
      onSubmit={handleSubmit(onSubmit)}
      className='flex-1 py-4'>
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id', {required:'id is required'})}
      />
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[3fr,1fr] lg:gap-8">
        <div>
          <div className="grid grid-cols-[1fr,4fr] gap-8">
          <ControlledTextField
            options={{
              name: 'position',
              type: 'number',
              label: config.position.label,
              useNull: true,
              defaultValue: page?.position ?? 1,
              helperTextMessage: config.position.help,
              // helperTextCnt: `${formData?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.position.validation}
          />
          <ControlledTextField
            options={{
              name: 'slug',
              label: config.slug.label,
              useNull: true,
              defaultValue: page?.slug,
              helperTextMessage: config.slug.help,
              helperTextCnt: `${formData?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.slug.validation}
            />
          </div>
          <div className="py-4"></div>
          <ControlledTextField
            options={{
              name: 'title',
              label: config.title.label,
              useNull: true,
              defaultValue: page?.title,
              helperTextMessage: config.title.help,
              helperTextCnt: `${formData?.title?.length || 0}/${config.title.validation.maxLength.value}`,
            }}
            control={control}
            rules={config.title.validation}
          />
        </div>
        <div className="flex justify-between items-start pb-8">
          <ControlledSwitch
            name='is_published'
            label={config.is_published.label}
            control={control}
            defaultValue={formData.is_published}
          />
           <Button
            type="submit"
            id="save-button"
            variant="contained"
            tabIndex={0}
            sx={{
              // overwrite tailwind preflight.css for submit type
              '&[type="submit"]:not(.Mui-disabled)': {
                backgroundColor: 'primary.main',
              },
            }}
            endIcon={<SaveIcon />}
            disabled={!isValid || !isDirty}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="py-4"></div>
      <MarkdownInputWithPreview
        markdown={formData?.description || ''}
        register={register('description', {
          maxLength: config.description.validation.maxLength.value
        })}
        disabled={false}
        helperInfo={{
          length: formData?.description?.length ?? 0,
          maxLength: config.description.validation.maxLength.value
        }}
      />
    </form>
  )
}
