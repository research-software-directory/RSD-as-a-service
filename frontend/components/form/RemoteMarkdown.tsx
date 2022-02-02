import {useState,useEffect} from 'react'
import TextFieldWithCounter from './TextFieldWithCounter'
import ReactMarkdown from 'react-markdown'
import logger from '../../utils/logger'
import PageErrorMessage from '../layout/PageErrorMessage'

export default function RemoteMarkdown({
  formData,register,config,errors
}: { formData: any, register: any, config: any, errors: any }) {

  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState<{statusCode:number,message:string}>()

  useEffect(() => {
    // debugger
    let abort = false
    if (!errors?.description_url &&
      formData.description_url?.length > 5){
      fetch(formData.description_url)
        .then(resp => {
          debugger
          if (resp.status === 200) {
            return resp.text()
          } else {
            // create error
            setError({
              statusCode: resp.status,
              message: resp.statusText
            })
            return Promise.resolve('')
          }
        })
        .then((body:any) => {
          if (abort) return
          setMarkdown(body)
        })
        .catch(e => {
          const message = 'Failed to fetch markdown file.'
          logger(message, 'error')
          setError({
            statusCode: 404,
            message,
          })
        })
    }
    ()=>{abort=true}
  },[formData.description_url, errors?.description_url])


  return (
    <div>
      <TextFieldWithCounter
        options={{
          // autofocus: formData?.description_type === 'link',
          disabled: formData?.description_type !== 'link',
          error: errors?.description_url !== undefined,
          label: config.description_url.label,
          helperTextMessage: errors?.description_url?.message ?? config.description_url.help,
          helperTextCnt:`${formData?.description_url?.length || 0}/200`
        }}
        register={register('description_url', {
          maxLength: {value: 200, message: 'Maximum length is 200'},
          pattern: {
            value: /^https?:\/\/.+\..+.md$/,
            message:'Url should start with http(s):// have at least one dot (.) and end with (.md)'
          }
        })}
      />
      <h2 className="py-4 text-sm font-medium text-primary tracking-[0.125rem] uppercase">PREVIEW</h2>
      <div className="border rounded-sm min-h-[33rem] flex">
        {error ?
          <PageErrorMessage
            {...error}
          />
          :
          <ReactMarkdown
            className="prose py-4 px-8"
            linkTarget="_blank"
          >
            {markdown}
          </ReactMarkdown>
        }
      </div>
    </div>
  )
}
