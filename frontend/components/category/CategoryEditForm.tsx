// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import {Controller, useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {CategoryEntry} from '~/types/Category'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import ControlledSwitch from '../form/ControlledSwitch'

export type CategoryEditFormLabels = Readonly<{
  short_name: string,
  name: string
}>

type CategoryEditFormProps=Readonly<{
  createNew: boolean
  data: CategoryEntry | null
  community: string | null
  organisation: string | null
  onSuccess: (category:CategoryEntry)=>void
  onCancel: ()=>void
  labels?: CategoryEditFormLabels
}>

export default function CategoryEditForm({
  createNew, data, community=null,organisation=null,onSuccess, onCancel,
  labels
}:CategoryEditFormProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [disableSave, setDisableSave] = useState<boolean>(false)
  const {register, control, handleSubmit, formState, watch} = useForm<CategoryEntry>({
    mode: 'onChange'
  })

  // use id of current item as parentId of new (child) item
  const parentId = createNew ? data?.id : data?.parent

  // console.group('CategoryEditForm')
  // console.log('createNew...',createNew)
  // console.log('data...',data)
  // console.log('disableSave...',disableSave)
  // console.log('community...',community)
  // console.log('organisation...',organisation)
  // console.log('parentId...',parentId)
  // console.groupEnd()

  function onSubmit(formData: CategoryEntry){
    setDisableSave(true)
    // debugger
    if (createNew) {
      createNewCategory(prepareDataForSave(formData))
    } else {
      updateCategory(prepareDataForSave(formData))
    }
  }

  function prepareDataForSave(formData: CategoryEntry){
    // fix provenance_iri empty value
    if (formData.provenance_iri===''){
      formData.provenance_iri = null
    }
    return formData
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

  function getFormTitle(){
    if (createNew===true){
      if (data?.short_name){
        return `Add category to ${data?.short_name}`
      }
      return 'Add section header'
    }else{
      return `Edit ${data?.short_name}`
    }
  }

  return (
    <form
      className="px-8 py-4 border rounded-md bg-base-200 my-4 ml-4 mr-6"
      onSubmit={handleSubmit(onSubmit)}
    >

      {/* Different hidden values when creating new item.*/}
      {createNew ?
        // use id of current item as parent for new (child) item
        <input type="hidden" {...register('parent', {value: parentId ?? null})} />
        :
        <>
          <input type="hidden" {...register('id', {value: data?.id})} />
          <input type="hidden" {...register('parent', {value: parentId ?? null})} />
        </>
      }
      <input type="hidden" {...register('community', {value: community})} />
      <input type="hidden" {...register('organisation', {value: organisation})} />

      <h3 className="py-4 text-base-content-secondary">{getFormTitle()}</h3>

      <TextFieldWithCounter
        register={register('short_name', {
          maxLength: {value: 100, message: 'max length is 100'},
          required: 'The short name is required'})
        }
        options={{
          label: 'Short name *',
          defaultValue: createNew ? undefined : data?.short_name,
          helperTextCnt: `${watch('short_name')?.length ?? 0}/100`,
          helperTextMessage: `${formState.errors?.short_name?.message ?? labels?.short_name ?? ''}`,
          error: formState.errors?.short_name?.message !== undefined,
          autofocus: true
        }}
      />
      <div className="py-2"/>
      <TextFieldWithCounter
        register={register('name', {
          maxLength: {value: 250, message: 'max length is 250'},
          required: 'The name is required'})
        }
        options={{
          label: 'Name *',
          defaultValue: createNew ? undefined : data?.name,
          helperTextCnt: `${watch('name')?.length ?? 0}/250`,
          helperTextMessage: `${formState.errors?.name?.message ?? labels?.name ?? ''}`,
          error: formState.errors?.name?.message !== undefined
        }}
      />
      <div className="py-2"/>
      <TextFieldWithCounter
        register={register('provenance_iri', {
          maxLength: {value: 250, message: 'max length is 250'}
        })}
        options={{
          label: 'Provenance identifier',
          defaultValue: createNew ? undefined : (data?.provenance_iri ?? undefined),
          helperTextCnt: `${watch('provenance_iri')?.length ?? 0}/250`,
          helperTextMessage: `${formState.errors?.provenance_iri?.message ?? 'Optional Internationalized Resource Identifier for this category'}`,
          error: formState.errors?.provenance_iri?.message !== undefined
        }}
      />

      {/*
        Organisation categories can be used for software or project items
        We show software/project switch only at top level (root nodes)
      */}
      {
        organisation && !parentId ?
          <div className="flex gap-8 pt-8">
            <ControlledSwitch
              label="For software"
              name="allow_software"
              defaultValue = {data?.allow_software}
              control={control}
            />
            <ControlledSwitch
              label="For projects"
              name="allow_projects"
              defaultValue = {data?.allow_projects ?? true}
              control={control}
            />
          </div>
          :
          <>
            {/*
              for children nodes we use false as default value
            */}
            <input type="hidden" {...register('allow_software', {value: false})} />
            <input type="hidden" {...register('allow_projects', {value: false})} />
          </>
      }

      {/* Highlight options are only for the top level items of general categories */}
      {((createNew && data === null && community===null && organisation===null) ||
        (!createNew && data?.parent === null && community===null && organisation===null)) ?
        <>
          <div className="py-4"/>
          <Controller
            name="properties.is_highlight"
            control={control}
            defaultValue={data?.properties.is_highlight ?? false}
            render={({field: {onChange, value}}) => (
              <FormControlLabel
                control={<Switch checked={value ?? false} onChange={onChange} />}
                label="Highlight"
              />
            )}
          />
          <div className="py-2"/>
          <TextFieldWithCounter
            register={register('properties.description')}
            options={{
              label: 'Description',
              disabled: !watch('properties.is_highlight'),
              defaultValue: createNew ? undefined : data?.properties.description,
              error: formState.errors?.properties?.description?.message !== undefined
            }}
          />
          <div className="py-2"/>
          <TextFieldWithCounter
            register={register('properties.subtitle')}
            options={{
              label: 'Subtitle',
              disabled: !watch('properties.is_highlight'),
              defaultValue: createNew ? undefined : data?.properties.subtitle,
              error: formState.errors?.properties?.subtitle?.message !== undefined
            }}
          />
        </>
        :null
      }

      <div className="flex gap-4 justify-end pt-8 pb-4">
        <Button
          variant="text"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={disableSave || !formState.isValid}>
          Save
        </Button>
      </div>
    </form>
  )
}
