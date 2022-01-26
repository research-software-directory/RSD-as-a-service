import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useForm} from 'react-hook-form'

import {useAuth} from '../../../auth'
import {getSlugFromString} from '../../../utils/getSlugFromString'
import {NewSoftwareItem} from '../../../types/SoftwareItem'
import {addSoftware} from '../../../utils/editSoftware'
import HelperTextWithCounter from './HelperTextWithCounter'

type AddSoftwareForm = {
  title: string,
  short_statement:string
}

const initalState = {
  open: false,
  loading: false,
  error:''
}

const addInfo = `
Please provide title and short statement for your software.
The url will be automatically generated from title and shown under the "Slug" label.
`

export default function AddSoftwareModal({action = 'close', onCancel}: { action: string, onCancel: Function }) {
  const {session} = useAuth()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const router = useRouter()
  const [state, setState] = useState(initalState)
  const {register, handleSubmit, watch, formState, reset} = useForm<AddSoftwareForm>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      short_statement:''
    }
  })
  const {errors, isDirty, isValid} = formState

  // console.group('AddSoftwareModal')
  // console.log('errors...', errors)
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.log('smallScreen...', smallScreen)
  // console.groupEnd()

  useEffect(() => {
    if (action.toLowerCase() === 'open' && state.open === false) {
      // debugger
      setState({
        ...state,
        open:true
      })
    }
    if (action.toLowerCase() !== 'open' && state.open === true) {
      debugger
      setState({
        ...state,
        open:true
      })
    }
  }, [action,state])

  function handleCancel() {
    // reset form
    reset()
    // callback to parent
    onCancel()
  }

  function onSubmit(data: AddSoftwareForm) {
    const {token} = session
    // set flags
    if (token && data) {
      setState({
        ...state,
        loading: true,
        error:''
      })
    }
    // create data object
    const software:NewSoftwareItem = {
      brand_name: data.title,
      short_statement: data.short_statement,
      slug: getSlugFromString(data.title),
      is_featured: false,
      is_published: false,
      bullets: null,
      read_more: null,
      get_started_url: null,
      concept_doi: null
    }
    // add software to database
    addSoftware({
      software,
      token
    }).then(resp => {
      if (resp.status === 201) {
        // redirect to edit page
        // and remove software/add route from the history
        router.replace(`/software/${software.slug}/edit`)
      } else {
        // show error
        setState({
          ...state,
          loading: false,
          error: `Failed to add software. Error: ${resp.message}`
        })
      }
    })
  }

  function renderDialogText() {
    // show error message
    if (state.error) {
      return (
        <Alert severity="error">
          {state.error}
        </Alert>
      )
    }
    // show loading circle
    if (state.loading) {
      return (
        <CircularProgress size="1.5rem" />
      )
    }
    // show default info
    return addInfo
  }

  function isSaveDisabled() {
    if (state.loading==true) return true
    if (isValid === false) return true
    return false
  }

  // construct slug from title
  const data = watch(['title','short_statement'])
  const softwareSlug = getSlugFromString(data[0])

  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={state.open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        Add software
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{
          width:['100%','33rem']
        }}>
          <section className="min-h-[4rem]">
            {renderDialogText()}
          </section>
          <section className="py-4">
            <TextField
              autoFocus
              error={errors.title?.message!==undefined}
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              defaultValue=""
              FormHelperTextProps={{
                sx:{
                  display: 'flex',
                  justifyContent:'space-between'
                }
              }}
              helperText={
                <HelperTextWithCounter
                  message={
                    errors.title?.message ?
                    errors.title?.message :
                    'Provide title for your software page.'
                  }
                  count={`${data[0]?.length || 0}/100`}
                />
              }
              {...register('title', {
                required: 'Title is required',
                minLength: {value: 3, message: 'Minimum length is 3'},
                maxLength: {value: 100, message: 'Maximum length is 100'},
              })}
            />
            <div className="py-2"></div>
            <TextField
              multiline={true}
              maxRows={5}
              error={errors.short_statement?.message!==undefined}
              id="short_statement"
              label="Short description"
              type="text"
              fullWidth
              variant="standard"
              defaultValue=""
              FormHelperTextProps={{
                sx:{
                  display: 'flex',
                  justifyContent:'space-between'
                }
              }}
              helperText={
                <HelperTextWithCounter
                  message={
                    errors.short_statement?.message ?
                    errors.short_statement?.message :
                    'Provide short description of your software, to use as page subtitle.'
                  }
                  count={`${data[1]?.length}/300`}
                />
              }
              {...register('short_statement', {
                required: 'Short statement is required',
                minLength: {value: 10, message: 'Minimum length is 10'},
                maxLength: {value: 300, message: 'Maximum length is 300'},
              })}
            />
            <div className="mt-2 py-4">
              <div className="text-sm mb-2">Slug (generated from page title)</div>
              <div className="px-2 py-1 bg-grey-200 h-8">{softwareSlug}</div>
            </div>
          </section>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          border:'1px solid #eee'
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
            variant='contained'
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
}
