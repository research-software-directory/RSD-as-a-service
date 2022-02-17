import {useState,useEffect} from 'react'
import {useWatch,useFormState, FieldError} from 'react-hook-form'
import ControlledTextField, {ControlledTextFieldOptions} from './ControlledTextField'
import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'
import PageErrorMessage from '../layout/PageErrorMessage'
import {getRemoteMarkdown} from '../../utils/getSoftware'
import ContentLoader from '../layout/ContentLoader'
import {useDebounceValid} from '../../utils/useDebouce'

type ControlledRemoteMarkdownProps = {
  control: any,
  rules: any,
  options: ControlledTextFieldOptions,
}

export default function ControlledRemoteMarkdown({control, rules, options}: ControlledRemoteMarkdownProps) {
  // watch for change
  const markdownUrl = useWatch({control, name: options.name})
  const {errors} = useFormState({control})
  const debouncedUrl = useDebounceValid(markdownUrl,errors[options.name],1000)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<{
    markdown: string | null,
    error: {
      status: number | null,
      message: string | null
    }
  }>({
    markdown: null,
    error: {
      status:null,
      message: null
    }
  })
  // listen for error
  let error:FieldError|undefined
  if (errors.hasOwnProperty(options.name) === true) {
    error = errors[options.name]
  }

  // console.group(`ControlledRemoteMarkdown...${options.name}`)
  // console.log('markdownUrl...',markdownUrl)
  // console.log('debouncedUrl...',debouncedUrl)
  // console.log('errors...', errors)
  // console.log('error...', error)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    const getMarkdown=async(url:string)=>{
      setLoading(true)
      const markdown = await getRemoteMarkdown(url)
      // exit on abort
      if (abort) return
      if (typeof markdown === 'string') {
        setState({
          markdown,
          error: {
            status: null,
            message: null
          }
        })
      } else if (typeof markdown === 'object'){
        // create error
        setState({
          markdown: null,
          error: {
            ...markdown
          }
        })
      }
      setLoading(false)
    }
    // if there is markdownUrl value
    if (debouncedUrl &&
      debouncedUrl.length > 9) {
      if (abort) return
      getMarkdown(debouncedUrl)
    } else if (!debouncedUrl) {
      if (abort) return
      setLoading(false)
      setState({
        markdown: '',
        error: {
          status: 200,
          message: 'Waiting for input'
        }
      })
    }
    return ()=>{abort=true}
  }, [debouncedUrl])

  function renderContent() {
    if (loading) {
      return (<ContentLoader />)
    }
    if (state.error?.status) {
      return (
        <PageErrorMessage
          status={state.error?.status ?? undefined}
          message={state.error?.message ?? 'Server error'}
        />
      )
    }
    if (state.markdown) {
      return (
        <ReactMarkdownWithSettings
          className='py-4 px-8'
          markdown={state?.markdown ?? ''}
        />
      )
    }
  }

  return (
    <div>
      <ControlledTextField
        options={options}
        control={control}
        rules={rules}
      />
      <h2 className="py-4 text-sm font-medium text-primary tracking-[0.125rem] uppercase">PREVIEW</h2>
      <div className="border rounded-sm min-h-[33rem] flex">
        {renderContent()}
      </div>
    </div>
  )
}


