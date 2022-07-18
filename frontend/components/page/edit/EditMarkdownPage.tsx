import {useForm} from 'react-hook-form'
import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'

import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import config from './config'
import {MarkdownPage} from '../useMarkdownPages'

import {saveMarkdownPage} from '../saveMarkdownPage'
import ControlledSlugTextField from '~/components/form/ControlledSlugTextField'

export type SubmitProps = {
  status: number
  message: string
  data: {
    id: string
    slug: string
    title: string
    is_published: boolean
  }
}

type EditMarkdownPageProps = {
  token: string,
  page?: MarkdownPage
  onDelete: (page: MarkdownPage) => void
  onSubmit: ({status,message,data}:SubmitProps) => void
}

export default function EditMarkdownPage({token,page,onDelete,onSubmit}:EditMarkdownPageProps) {
  // const {showErrorMessage,showSuccessMessage} = useSnackbar()
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
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData.slug...', formData?.slug)
  // console.log('page.slug...', page?.slug)
  // console.groupEnd()

  async function savePage(data: MarkdownPage) {
    // save page
    const resp = await saveMarkdownPage({
      page:data,
      token
    })
    if (resp.status == 200) {
      // reset form status after save
      reset(data)
      // pass info to parent
      onSubmit({
        status: 200,
        message: `${data.title} page saved`,
        data: {
          id: data?.id ?? '',
          slug: data.slug ?? '',
          title: data?.title ?? '',
          is_published: data.is_published ?? false,
        }
      })
    } else {
      // pass info to parent
      onSubmit({
        status: resp.status,
        message: `Failed to save ${data.title}. ${resp.message}`,
        data: {
          id: data?.id ?? '',
          slug: data.slug ?? '',
          title: data?.title ?? '',
          is_published: data.is_published ?? false,
        }
      })
    }
  }

  if (!page) return null

  return (
    <form
      id={page.slug}
      onSubmit={handleSubmit(savePage)}
      className='flex-1 py-4'>
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id')}
      />
      <input type="hidden"
        {...register('position')}
      />
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[3fr,1fr] lg:gap-8">
        <div className="grid grid-cols-[4fr,1fr] gap-8">
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
          <ControlledSwitch
            name='is_published'
            label={config.is_published.label}
            control={control}
            defaultValue={formData.is_published}
          />
        </div>
        <div className="flex justify-end items-center pb-8 lg:pb-0">
          <Button
            type="submit"
            id="save-button"
            variant="text"
            sx={{
              marginRight:'2rem'
              // overwrite tailwind preflight.css for submit type
              // '&[type="submit"]:not(.Mui-disabled)': {
              //   backgroundColor: 'primary.main',
              // },
            }}
            startIcon={<SaveIcon />}
            disabled={!isValid || !isDirty}
          >
            Save
          </Button>
          <Button
            id="delete-button"
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={()=>onDelete(page)}
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="py-4"></div>
      <ControlledSlugTextField
        options={{
          name:'slug',
          label: config.slug.label,
          baseUrl: config.slug.baseUrl(),
          defaultValue: formData.slug,
          helperTextMessage: config.slug.help,
        }}
        control={control}
        rules={config.slug.validation}
      />
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
