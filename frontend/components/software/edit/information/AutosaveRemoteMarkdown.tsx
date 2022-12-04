// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {useWatch,useFormState} from 'react-hook-form'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {getRemoteMarkdown} from '~/utils/getSoftware'
import ContentLoader from '~/components/layout/ContentLoader'
import {useDebounceValid} from '~/utils/useDebounce'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'

type AutosaveRemoteMarkdownProps = {
  control: any,
  rules: any,
  options: ControlledTextFieldOptions,
  onSaveField: ({name,value}: OnSaveProps) => void
}

export default function AutosaveRemoteMarkdown({control,rules,options,onSaveField}: AutosaveRemoteMarkdownProps) {
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
  let error:any
  if (errors.hasOwnProperty(options.name) === true) {
    error = errors[options.name]
  }

  // console.group(`AutosaveRemoteMarkdownProps...${options.name}`)
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
          breaks={false}
        />
      )
    }
  }

  return (
    <div>
     <AutosaveControlledTextField
        options={options}
        control={control}
        rules={rules}
        onSaveField={onSaveField}
      />
      <h2 className="py-4 text-sm font-medium text-primary tracking-[0.125rem] uppercase">PREVIEW</h2>
      <div className="border rounded-sm min-h-[33rem] flex">
        {renderContent()}
      </div>
    </div>
  )
}
