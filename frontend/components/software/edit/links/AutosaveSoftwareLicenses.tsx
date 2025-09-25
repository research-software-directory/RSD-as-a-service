// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useEffect, useState} from 'react'
import Chip from '@mui/material/Chip'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import useSpdxLicenses from '~/utils/useSpdxLicenses'
import {sortBySearchFor} from '~/utils/sortFn'
import {addLicensesForSoftware, deleteLicense} from '~/components/software/edit/apiEditSoftware'
import {getSlugFromString} from '~/utils/getSlugFromString'
import {EditSoftwareItem, License, LicenseForSoftware} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import AsyncAutocompleteSC, {
  AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import ImportLicensesFromDoi from './ImportLicensesFromDoi'
import EditLicenseModal from './EditLicenseModal'
import {config} from './config'


type LicenseModalProps={
  open: boolean,
  data?: LicenseForSoftware
}

// Short list of widely used open source licenses
const keyList=[
  'AGPL-3.0',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC-BY-4.0',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'LGPL-2.0-only',
  'LGPL-2.1-only',
  'LGPL-3.0-only',
  'MIT'
]

export default function AutosaveSoftwareLicenses() {
  const {token} = useSession()
  const {software: {id}} = useSoftwareContext()
  const {showErrorMessage} = useSnackbar()
  const {options:allOptions} = useSpdxLicenses({software:id??''})
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })
  const [shortList, setShortList] = useState<AutocompleteOption<License>[]>([])
  const [options, setOptions] = useState<AutocompleteOption<License>[]>([])
  const [modal, setModal] = useState<LicenseModalProps>({
    open: false
  })
  const {watch,setValue,formState:{errors}} = useFormContext<EditSoftwareItem>()
  const [licenses,concept_doi] = watch(['licenses','concept_doi'])
  const validDoi = errors?.concept_doi ? false : true

  // console.group('AutosaveSoftwareLicenses')
  // console.log('options...', options)
  // console.log('allOptions...', allOptions)
  // console.log('shortList...', shortList)
  // console.log('licenses...', licenses)
  // console.log('concept_doi...', concept_doi)
  // console.log('errors...', errors)
  // console.log('validDoi...', validDoi)
  // console.groupEnd()

  useEffect(()=>{
    let abort=false
    if (allOptions.length>0){
      // select from the list but only if not deprecated
      const selection = allOptions.filter(option=>{
        return (keyList.includes(option.key) && option.data.deprecated===false)
      })
      if (selection.length > 0 && abort===false) {
        setShortList(selection)
        setOptions(selection)
      }
    }
    return ()=>{abort=true}
  },[allOptions])

  function setLicenses(items:AutocompleteOption<License>[]){
    // save licenses in the form context
    setValue('licenses',items,{
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false
    })
  }

  function searchLicense(searchFor: string) {
    // console.log('searchLicense...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, foundFor: undefined})
    // filter options
    const found = allOptions.filter(item => {
      // find license by key or label match
      return (
        item.label.toLowerCase().includes(searchFor.trim().toLowerCase()) ||
        item.key.toLowerCase().includes(searchFor.trim().toLowerCase())
      )
    })
    const sorted = found.sort((a, b) => sortBySearchFor(a, b, 'label', searchFor))
    // debugger
    // console.log('searchLicense...sorted...', sorted)
    // set options
    setOptions(sorted)
    // debugger
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  async function onAddLicense(selected: AutocompleteOption<License>) {
    // check if already added
    const find = licenses.filter(item => item?.label?.toLocaleLowerCase() === selected?.label?.toLocaleLowerCase())
    // otherwise add it
    if (find.length === 0) {
      const license:LicenseForSoftware = {
        software: id ?? '',
        license: selected.key,
        name: selected.label,
        reference: selected.data.reference,
        open_source: selected.data.open_source
      }
      const resp = await addLicensesForSoftware({
        license,
        token
      })
      if (resp.status === 201) {
        // update id
        selected.data.id = resp.message
        const newList = [
          ...licenses,
          selected
        ]
        // list of selected licenses
        setLicenses(newList)
        // reset options list to short list of licenses
        setOptions(shortList)
      } else {
        showErrorMessage(`Failed to add license. ${resp.message}`)
      }
    }
  }

  function onCreateLicense(newInputValue: string) {
    // trim input
    const newLicense = newInputValue.trim()
    // look if license is already added
    const find = licenses.filter(item => item?.label?.toLowerCase() === newLicense.toLowerCase())
    // if not found
    if (find.length === 0) {
      const newLicense:LicenseForSoftware = {
        software: id,
        license: getSlugFromString(newInputValue,'-',false),
        name: newInputValue,
        reference: null,
        open_source: true
      }
      // show modal to create new license
      setModal({
        open:true,
        data: newLicense
      })
    }
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<License>) {
    return (
      <li {...props} key={option.key} data-testid="add-license-option">
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<License>
  ) {
    // console.log('renderOption...', option)
    // when value is not found option returns input prop
    if (option?.input) {
      // if input is over minLength
      if (option?.input.length >= config.licenses.modal.license.validation.minLength.value) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li {...props} key={option.key} title={option.label}>
        {/* if option is deprecated include in label  */}
        {option.data?.deprecated ?
          <span className="text-warning">{option.key} ({option.label}) - DEPRECATED</span>
          : <span>{option.key} <span className="text-base-content-disabled">({option.label})</span></span>
        }
      </li>
    )
  }

  async function onRemove(pos: number) {
    const item = licenses[pos]
    if (item.data.id) {
      const resp = await deleteLicense({
        id: item.data.id,
        token
      })
      if (resp.status === 200) {
        // remove(pos)
        const newList = [
          ...licenses.slice(0, pos),
          ...licenses.slice(pos+1)
        ]
        setLicenses(newList)
      } else {
        showErrorMessage(`Failed to remove license. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to remove license. License id MISSING!')
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.licenses.title}
        subtitle={config.licenses.subtitle}
      >
        <ImportLicensesFromDoi
          concept_doi={validDoi && concept_doi ? concept_doi : null}
          items={licenses}
          onSetLicenses={setLicenses}
        />
      </EditSectionTitle>
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchLicense}
        onAdd={onAddLicense}
        onCreate={onCreateLicense}
        onRenderOption={renderOption}
        onClear={()=>setOptions(shortList)}
        config={{
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: true,
          minLength: config.licenses.validation.minLength,
          label: config.licenses.label,
          help: config.licenses.help,
          reset: true
        }}
      />
      <div className="flex flex-wrap py-2">
        {licenses.map((item, pos) => {
          return(
            <div
              key={item.key}
              className="py-1 pr-1"
            >
              <Chip
                data-testid="license-chip"
                title={item.label}
                label={
                  item.data?.reference ?
                    <a href={item.data?.reference} target="_blank">
                      {item.key}
                    </a>
                    : <span>{item.key}</span>
                }
                onDelete={() => onRemove(pos)}
              />
            </div>
          )
        })}
      </div>
      {
        modal.open ?
          <EditLicenseModal
            open={modal.open}
            data={modal.data}
            onCancel={()=>{
              setModal({open:false})
              setOptions(shortList)
            }}
            onSubmit={(data)=>{
              // close modal
              setModal({
                open: false
              })
              // add license
              onAddLicense({
                key: data.license,
                label: data.name,
                data
              })
            }}
          />
          : null
      }
    </>
  )
}
