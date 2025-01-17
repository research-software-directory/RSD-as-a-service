// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import {useForm} from 'react-hook-form'

import TextFieldWithCounter from '~/components/form/TextFieldWithCounter'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'
import {RsdInfo} from './apiRsdInfo'
import {rsdInfoForm} from './config'

type RsdInfoModalProps=Readonly<{
  onCancel: () => void,
  onSubmit: (item: RsdInfo) => void
}>

const formId='add-remote-rsd-form'

function RsdInfoModal({onCancel,onSubmit}:RsdInfoModalProps){
  const smallScreen = useMediaQuery('(max-width:600px)')
  const {formState:{errors,isValid,isDirty}, control, watch, register, handleSubmit} = useForm<RsdInfo>({
    mode: 'onChange',

  })

  // watch for data change in the form
  const [key,value] = watch(['key','value'])

  function handleCancel(e:any,reason: 'backdropClick' | 'escapeKeyDown') {
    // close only on escape, not if user clicks outside of the modal
    if (reason==='escapeKeyDown') onCancel()
  }

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={true}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {rsdInfoForm.modalTitle}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full">

        <DialogContent sx={{
          width: ['100%', '37rem'],
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <TextFieldWithCounter
            options={{
              autofocus:true,
              error: errors.key?.message !== undefined,
              label: rsdInfoForm.key.label,
              helperTextMessage: errors?.key?.message ?? rsdInfoForm.key.help,
              helperTextCnt: `${key?.length || 0}/${rsdInfoForm.key.validation.maxLength.value}`,
              variant:'outlined',
              // endAdornment: validating ? <CircularProgress /> : undefined
            }}
            register={register('key', {
              ...rsdInfoForm.key.validation
            })}
          />

          <div className="py-4" />

          <TextFieldWithCounter
            options={{
              error: errors.value?.message !== undefined,
              label: rsdInfoForm.value.label,
              helperTextMessage: errors?.value?.message ?? rsdInfoForm.value.help,
              helperTextCnt: `${value?.length || 0}/${rsdInfoForm.value.validation.maxLength.value}`,
              variant:'outlined',
              // endAdornment: validating ? <CircularProgress /> : undefined
            }}
            register={register('value', {
              ...rsdInfoForm.value.validation
            })}
          />

          <div className="grid grid-cols-2 gap-20 items-start pt-8">
            <ControlledSwitch
              label="Public"
              name="public"
              control={control}
              defaultValue={true}
            />
          </div>

        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            onClick={onCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            formId={formId}
            disabled={isSubmitDisabled()}
          />
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSubmitDisabled(){
    if (isValid===false) return true
    // we need additional check on errors object
    // due to custom validation of domain
    if (Object.keys(errors).length > 0) return true
    if (isDirty===false) return true
    return false
  }
}


export default function AddRsdInfo({onAdd}:Readonly<{onAdd:(data:RsdInfo)=>void}>) {
  const [modal,setModal] = useState(false)

  return (
    <>
      <Button
        variant='contained'
        startIcon={<AddIcon/> }
        onClick={()=>setModal(true)}
      >
        Add
      </Button>
      {
        modal ? <RsdInfoModal
          onCancel={()=>setModal(false)}
          onSubmit={(data)=>{
            setModal(false)
            onAdd(data)
          }}
        />
          : null
      }
    </>
  )
}
