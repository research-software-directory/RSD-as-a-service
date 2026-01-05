// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import {useFormContext} from 'react-hook-form'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import {useSession} from '~/auth/AuthProvider'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import ControlledTextField from '~/components/form/ControlledTextField'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import ControlledSlugTextField from '~/components/form/ControlledSlugTextField'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import ContentLoader from '~/components/layout/ContentLoader'
import config from './config'
import {getMarkdownPage, MarkdownPage} from '../useMarkdownPages'
import {saveMarkdownPage} from '../saveMarkdownPage'

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

export type EditMarkdownPageProps = {
  slug: string
  onDelete: (page: MarkdownPage) => void
  onSubmit: ({status,message,data}:SubmitProps) => void
}

export default function EditMarkdownPage({slug,onDelete,onSubmit}:EditMarkdownPageProps) {
  const {token} = useSession()
  const [loading, setLoading] = useState(true)
  const [loadedSlug, setLoadedSlug]=useState<string>()
  const {
    register, handleSubmit, watch, formState, reset, control
  } = useFormContext()
  // destructure formState
  const {isDirty, isValid} = formState
  // form data provided by react-hook-form
  const formData = watch()

  const getMarkdown = useCallback(() => {
    setLoading(true)
    getMarkdownPage({slug, token, is_published: false})
      .then(resp => {
        if (resp.page) {
          reset(resp.page)
          setLoadedSlug(slug)
        }
      })
      .finally(() =>
        setLoading(false)
      )
  },[slug,token,reset])

  useEffect(() => {
    // request fetching data from database
    // only if form is not dirty, info present
    // and not already loaded
    // FIX: this logic is required to prevent reloading
    // of the form/data when token is refreshed
    if (slug && token &&
      slug!==loadedSlug
    ) {

      getMarkdown()
    }
  }, [slug, loadedSlug, token, getMarkdown])

  // console.group('EditMarkdownPage')
  // console.log('loading...', loading)
  // console.log('token...', token)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData...', formData)
  // console.log('slug...', slug)
  // console.log('loadedSlug...', loadedSlug)
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

  // loading
  if (loading) return <ContentLoader />

  return (
    <form
      id='edit-markdown'
      data-testid="edit-markdown-form"
      onSubmit={handleSubmit(savePage)}
      className='flex-1 py-4'>
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id')}
      />
      <input type="hidden"
        {...register('position')}
      />
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[3fr_1fr] lg:gap-8">
        <div className="grid grid-cols-[4fr_1fr] gap-8">
          <ControlledTextField
            options={{
              name: 'title',
              label: config.title.label,
              useNull: true,
              // defaultValue: page?.title,
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
          <SubmitButtonWithListener
            disabled={!isValid || !isDirty}
            formId={'edit-markdown'}
          />
          <Button
            id="delete-button"
            variant="text"
            color="error"
            endIcon={<DeleteIcon />}
            onClick={() => {
              onDelete(formData)
            }}
            sx={{
              marginLeft:'1rem'
            }}
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
          defaultValue: formData.slug ?? '',
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
