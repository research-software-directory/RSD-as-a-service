// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import Button from '@mui/material/Button'
import {useWatch,useFormState, useFormContext} from 'react-hook-form'

import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {useDebounceValid} from '~/utils/useDebounce'
import {apiRemoteMarkdown} from '~/components/software/apiSoftware'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import ContentLoader from '~/components/layout/ContentLoader'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import {softwareInformation as config} from '../editSoftwareConfig'

type AutosaveRemoteMarkdownProps = Readonly<{
  rules: any,
  options: ControlledTextFieldOptions<EditSoftwareItem>,
  onSaveField: ({name,value}: OnSaveProps<EditSoftwareItem>) => void
}>

export default function AutosaveRemoteMarkdown({rules,options,onSaveField}: AutosaveRemoteMarkdownProps) {
  const {control, setError, setValue} = useFormContext()
  const {errors} = useFormState({control})
  const markdownUrl = useWatch({control, name: options.name})
  const debouncedUrl = useDebounceValid(markdownUrl,errors[options.name],700)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<{
    markdown: string | null,
    error: {
      status: number | null,
      message: string | null,
      rawUrl?: string
    }
  }>({
    markdown: null,
    error: {
      status:null,
      message: null
    }
  })

  // console.group(`AutosaveRemoteMarkdownProps...${options.name}`)
  // console.log('markdownUrl...',markdownUrl)
  // console.log('debouncedUrl...',debouncedUrl)
  // console.log('errors...', errors)
  // console.log('state...', state)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    const getMarkdown=async(url:string)=>{
      setLoading(true)
      const resp = await apiRemoteMarkdown(url)
      // exit on abort
      if (abort) return
      if (resp.status===200) {
        // debugger
        setState({
          markdown: resp.message,
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
            ...resp
          }
        })
        // set error to input form
        setError(options.name,{
          type:'custom',
          message: resp.message
        })
      }
      setLoading(false)
    }
    // if there is markdownUrl value
    if (debouncedUrl && debouncedUrl.length > 9) {
      if (abort) return
      getMarkdown(debouncedUrl)
    }
    return ()=>{abort=true}
  }, [debouncedUrl,options.name,setError])

  function useSuggestedUrl(){
    if (state.error?.rawUrl){
      // change input value
      setValue(options.name,state.error?.rawUrl,{
        shouldValidate:true,
        shouldDirty:true
      })
      // save change
      onSaveField({
        name: options.name,
        value: state.error?.rawUrl
      })
    }
  }

  function renderContent() {
    if (loading) {
      return (<ContentLoader />)
    }
    if (state.error?.status) {
      return (
        <PageErrorMessage
          status={state.error?.status ?? undefined}
          message={state.error?.message ?? 'Server error'}
        >
          <div className="px-4 ">
            <div className="text-error py-4">{state.error?.message ?? 'Incorrect link'}</div>
            { state.error?.rawUrl ?
              <>
                <div>
                  <span className="font-medium">Suggestion: </span>
                  <a href={state.error?.rawUrl} target="_blank">{state.error?.rawUrl}</a>
                </div>
                <div className="py-4">
                  <Button
                    variant="contained"
                    disabled = {!state.error?.rawUrl}
                    onClick={useSuggestedUrl}>
                    Use suggestion
                  </Button>
                </div>
              </>
              : config.description_url.help
            }
          </div>
        </PageErrorMessage>
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
    <div className="pt-4">
      <AutosaveControlledTextField
        options={options}
        control={control}
        rules={rules}
        onSaveField={onSaveField}
      />
      <h2 className="py-4 text-sm font-medium text-primary tracking-[0.125rem]">Preview</h2>
      <div className="border rounded-xs min-h-[34rem] flex">
        {renderContent()}
      </div>
    </div>
  )
}
