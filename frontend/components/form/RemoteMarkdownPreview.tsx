import {useState,useEffect} from 'react'
import TextFieldWithCounter from './TextFieldWithCounter'
import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'
import PageErrorMessage from '../layout/PageErrorMessage'
import {getRemoteMarkdown} from '../../utils/getSoftware'

type RemoteMarkdownPreviewType = {
  register: any,
  errors: any,
  url: string,
  label: string,
  help: string
}

export default function RemoteMarkdownPreview({register, errors, url, label, help}: RemoteMarkdownPreviewType) {
  // const [markdown, setMarkdown] = useState('')
  // const [error, setError] = useState<{ statusCode: number, message: string }>()
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
    if (typeof errors == 'undefined' && url?.length > 9) {
      // debugger
      getRemoteMarkdown(url)
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
        })
    } else {
      // debugger
      setState({
        markdown: null,
        error: {
          status: 400,
          message: 'Invalid information'
        }
      })
    }
    return ()=>{abort=true}
  },[url, errors])

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
        {state.error?.status ?
          <PageErrorMessage
            status={state.error?.status ?? undefined}
            message={state.error?.message ?? 'Server error'}
          />
          :
          <ReactMarkdownWithSettings
            className='py-4 px-8'
            markdown={state?.markdown ?? ''}
          />
        }
      </div>
    </div>
  )
}
