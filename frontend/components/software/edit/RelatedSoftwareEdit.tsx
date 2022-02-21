import {useContext, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'

import {app} from '../../../config/app'
import snackbarContext,{snackbarDefaults} from '../../snackbar/PageSnackbarContext'
import useRelatedSoftwareItems from '../../../utils/useRelatedSoftwareItems'
import useOnUnsaveChange from '../../../utils/useOnUnsavedChange'
import {AutocompleteOption} from '../../../types/AutocompleteOptions'
import {RelatedSoftware} from '../../../types/SoftwareTypes'
import EditSoftwareSection from './EditSoftwareSection'
import editSoftwareContext, {EditSoftwareActionType} from './editSoftwareContext'
import EditSectionTitle from './EditSectionTitle'
import ContentLoader from '../../layout/ContentLoader'
import ControlledAutocomplete from '../../form/ControlledAutocomplete'
import useRelatedSoftwareOptions from '../../../utils/useRelatedSoftwareOptions'
import {saveRelatedSoftware} from '../../../utils/editRelatedSoftware'
import {relatedSoftwareInformation as config} from './editSoftwareConfig'

type RelatedSoftwareForm = {
  relatedSoftware: AutocompleteOption<RelatedSoftware>[]
}

export default function RelatedSoftwareEdit({token}: { token: string }) {
  const {setSnackbar} = useContext(snackbarContext)
  const {pageState, dispatchPageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AutocompleteOption<RelatedSoftware>[]>([])
  const options = useRelatedSoftwareOptions({
    software: software?.id ?? '',
    token
  })
  const relatedSoftware = useRelatedSoftwareItems({
    software: software?.id ?? '',
    token
  })

  // destructure methods from react-hook-form
  const {handleSubmit,reset,control,formState} = useForm <RelatedSoftwareForm>({
    mode: 'onChange',
    defaultValues: {
      relatedSoftware:[]
    }
  })

  // destructure formState
  const {isDirty, isValid} = formState
  // form data provided by react-hook-form
  // const formData = watch()
  // watch for unsaved changes
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })

  // console.group('RelatedSoftwareEdit')
  // console.log('token...', token)
  // console.log('slug...', slug)
  // console.log('loading...', loading)
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('formData...', formData)
  // console.log('relatedSoftware...', relatedSoftware)
  // console.groupEnd()

  useEffect(() => {
    reset({
      relatedSoftware
    })
    setSelected(relatedSoftware)
    setLoading(false)
  }, [relatedSoftware, reset])

  useEffect(() => {
    // update form state
    // only if values are different (avoid loop)
    if (
      pageState?.isDirty !== isDirty ||
      pageState?.isValid !== isValid
    ) {
      dispatchPageState({
        type: EditSoftwareActionType.UPDATE_STATE,
        payload: {
          isDirty,
          isValid,
        }
      })
    }
  },[isDirty,isValid,pageState,dispatchPageState])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  function onSuccess() {
    // show notification
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity: 'success',
      duration: 5000,
      message: 'Saved related software'
    })
  }

  function onError(message:string) {
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity: 'error',
      duration: undefined,
      message: 'Failed to save related software'
    })
  }

  async function onSubmit(data:RelatedSoftwareForm) {
    if (typeof software?.id == 'undefined') return

    const resp = await saveRelatedSoftware({
      software: software?.id,
      relatedSoftware: data.relatedSoftware,
      referenceList: selected,
      token
    })

    if (resp && resp.status === 200) {
      setSelected(data.relatedSoftware)
      reset(data)
      onSuccess()
    } else {
      onError('Failed to save trelated software')
    }
  }

  return (
    <section className="flex-1">
      <EditSoftwareSection className="pl-8">
        <div className="py-4">
          <EditSectionTitle
            title={config.title}
            subtitle={config.subtitle}
          >
          </EditSectionTitle>
          <section className="py-4 max-w-[40rem]">
            <form
              id={pageState.step?.formId}
              onSubmit={handleSubmit(onSubmit)}
            >
              <ControlledAutocomplete
                name="relatedSoftware"
                control={control}
                options={options}
                label={config.help}
              />
            </form>
          </section>
        </div>
      </EditSoftwareSection>
    </section>
  )
}
