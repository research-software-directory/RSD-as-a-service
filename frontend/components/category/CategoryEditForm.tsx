// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {CategoryEntry} from '~/types/Category'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export default function CategoryEditForm({createNew, community, data, onSuccess}:
{
  createNew: boolean
  community: string | null
  data: CategoryEntry | null
  onSuccess: Function
}) {


  const [disableSave, setDisableSave] = useState<boolean>(false)
  const {register, control, handleSubmit, formState, watch} = useForm<CategoryEntry>({
    mode: 'onChange'
  })
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()

  if (createNew) {
    register('parent', {value: data === null ? null : data.id})
  } else {
    register('id', {value: data === null ? undefined : data.id})
    register('parent', {value: data === null ? null : data.parent})
  }
  register('community', {value: community})

  const onSubmit = (formData: CategoryEntry) => {
    setDisableSave(true)
    if (createNew) {
      createNewCategory(formData)
    } else {
      updateCategory(formData)
    }
  }

  async function createNewCategory(formData: CategoryEntry) {
    const resp = await fetch('/api/v1/category', {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        Prefer: 'return=representation',
        Accept: 'application/vnd.pgrst.object+json'

      },
      body: JSON.stringify(formData)
    })
    if (!resp.ok) {
      showErrorMessage(`Couldn't update category data, we got the following error: ${await resp.text()}`)
      setDisableSave(false)
      return
    }

    const newCategory: CategoryEntry = await resp.json()

    if (onSuccess) {
      onSuccess(newCategory)
    }
  }

  async function updateCategory(formData: CategoryEntry) {
    const id = data?.id
    if (!id) {
      showErrorMessage('Couldn\'t update a category without an ID')
      setDisableSave(false)
      return
    }

    const resp = await fetch(`/api/v1/category?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(formData)
    })
    if (!resp.ok) {
      showErrorMessage(`Couldn't update category data, we got the following error: ${await resp.text()}`)
      setDisableSave(false)
      return
    }

    if (onSuccess) {
      onSuccess(formData)
    }
  }

  return (
    <form className="px-8" onSubmit={handleSubmit(onSubmit)}>
      <TextFieldWithCounter register={register('short_name', {
        maxLength: {value: 100, message: 'max length is 100'},
        required: 'The short name is required'})
      }
      options={{
        label: 'Short name *',
        defaultValue: createNew ? undefined : data?.short_name,
        helperTextCnt: `${watch('short_name')?.length ?? 0}/100`,
        helperTextMessage: `${formState.errors?.short_name?.message ?? ''}`,
        error: formState.errors?.short_name?.message !== undefined
      }} />
      <TextFieldWithCounter register={register('name', {
        maxLength: {value: 250, message: 'max length is 250'},
        required: 'The name is required'})
      }
      options={{
        label: 'Name *',
        defaultValue: createNew ? undefined : data?.name,
        helperTextCnt: `${watch('name')?.length ?? 0}/250`,
        helperTextMessage: `${formState.errors?.name?.message ?? ''}`,
        error: formState.errors?.name?.message !== undefined
      }} />
      <TextFieldWithCounter register={register('provenance_iri', {
        maxLength: {value: 250, message: 'max length is 250'}
      })}
      options={{
        label: 'Provenance identifier',
        defaultValue: createNew ? undefined : (data?.provenance_iri ?? undefined),
        helperTextCnt: `${watch('provenance_iri')?.length ?? 0}/250`,
        helperTextMessage: `${formState.errors?.name?.message ?? 'Optional Internationalized Resource Identifier for this category'}`,
        error: formState.errors?.name?.message !== undefined
      }} />
      {((createNew && data === null) || (!createNew && data?.parent === null)) && <Controller
        name="properties.is_highlight"
        control={control}
        defaultValue={data?.properties.is_highlight ?? false}
        render={({field: {onChange, value}}) => (
          <FormControlLabel
            control={<Switch checked={value ?? false} onChange={onChange} />}
            label="Highlight"
          />
        )}
      />}
      {watch('properties.is_highlight') && <>
        <TextFieldWithCounter register={register('properties.description')} options={{
          label: 'Description',
          defaultValue: createNew ? undefined : data?.properties.description,
          error: formState.errors?.properties?.description?.message !== undefined
        }}/>
        <TextFieldWithCounter register={register('properties.subtitle')} options={{
          label: 'Subtitle',
          defaultValue: createNew ? undefined : data?.properties.subtitle,
          error: formState.errors?.properties?.subtitle?.message !== undefined
        }}/>
      </>}
      <div></div>
      <Button type="submit" variant="contained" disabled={disableSave || !formState.isValid}>Save</Button>
    </form>
  )
}
