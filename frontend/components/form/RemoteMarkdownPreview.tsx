import {useState,useEffect} from 'react'
import TextFieldWithCounter from './TextFieldWithCounter'
import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'
import PageErrorMessage from '../layout/PageErrorMessage'
import {getRemoteMarkdown} from '../../utils/getSoftware'
import {useDebounceValid} from '../../utils/useDebouce'
import ContentLoader from '../layout/ContentLoader'

type RemoteMarkdownPreviewType = {
  register: any,
  errors: any,
  url: string,
  label: string,
  help: string
}

export default function RemoteMarkdownPreview({register, errors, url, label, help}: RemoteMarkdownPreviewType) {
  // const [markdown, setMarkdown] = useState('')
  const debuncedUrl = useDebounceValid(url, errors, 1000)
  const [loading,setLoading]=useState(false)
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

  useEffect(() => {
    let abort = false
    if (typeof errors == 'undefined') {
      // no errors - provided debounced value
      if (debuncedUrl && debuncedUrl?.length > 9) {
        setLoading(true)
        getRemoteMarkdown(debuncedUrl)
          .then(markdown => {
            // on abort exit
            if (abort) return
            // markdown is string
            if (typeof markdown === 'string') {
              setState({
                markdown,
                error: {
                  status: null,
                  message: null
                }
              })
            } else {
              // create error
              setState({
                markdown: null,
                error: {
                  ...markdown
                }
              })
            }
            setLoading(false)
          })
      } else if (debuncedUrl === '') {
        // debugger
        setLoading(false)
        setState({
          markdown: '',
          error: {
            status: 200,
            message: 'Waiting for input'
          }
        })
      }
    } else {
      setState({
        markdown: null,
        error: {
          status: 400,
          message: 'Invalid information.'
        }
      })
      setLoading(false)
    }
    return ()=>{abort=true}
  }, [debuncedUrl, errors])

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
      <TextFieldWithCounter
        options={{
          // autofocus: formData?.description_type === 'link',
          // disabled,
          error: errors !== undefined,
          label,
          helperTextMessage: errors?.message ?? help,
          helperTextCnt:`${url?.length || 0}/200`
        }}
        register={register}
      />
      <h2 className="py-4 text-sm font-medium text-primary tracking-[0.125rem] uppercase">PREVIEW</h2>
      <div className="border rounded-sm min-h-[33rem] flex">
        {renderContent()}
      </div>
    </div>
  )
}


