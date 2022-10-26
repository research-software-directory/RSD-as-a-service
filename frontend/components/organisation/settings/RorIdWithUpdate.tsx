// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import {useFormContext} from 'react-hook-form'
import CircularProgress from '@mui/material/CircularProgress'
import FindReplaceIcon from '@mui/icons-material/FindReplace'

import {useSession} from '~/auth'
import {SearchOrganisation} from '~/types/Organisation'
import {findInROR} from '~/utils/getROR'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {organisationInformation as config} from '../organisationConfig'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import RorIdOptionsModal from './RorIdOptionsModal'
import AutosaveOrganisationTextField from './AutosaveOrganisationTextField'
import {patchOrganisationTable} from './updateOrganisationSettings'

export default function FindRorId() {
  const {token} = useSession()
  const {watch, resetField} = useFormContext()
  const {showWarningMessage, showSuccessMessage, showInfoMessage} = useSnackbar()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<AutocompleteOption<SearchOrganisation>[]>([])
  // extract data from form
  const [id, ror_id, name] = watch(['id', 'ror_id', 'name'])

  async function FindRorOrganisation() {
    // set loading flag
    setLoading(true)
    // find by organisation name
    const options = await findInROR({searchFor: name})
    // make slug from name
    // const key = getSlugFromString(name)
    // match the results by key/slug
    const found = options.filter(item => item.label.toLowerCase() === name.toLowerCase())
    // if exact match
    if (found.length === 1) {
      // extract ror id
      const id = found[0].data.ror_id
      if (id === ror_id) {
        showInfoMessage(`The ROR id for ${name} is correct.`)
      } else if (id) {
        updateValue(id)
        showSuccessMessage(`Updated ROR id for ${name}.`)
      }
    } else {
      if (options.length > 0) {
        // set possible options
        setOptions(options)
        // show modal to select one
        setOpen(true)
        // showWarningMessage('Failed to find exact match. Select from alternatives.')
      } else {
        showWarningMessage(`Failed to find exact match for ${name}. Check the organisation name.`)
      }
    }
    // set loading done
    setLoading(false)
  }

  async function updateValue(ror_id: string) {
    // close modal if open
    if (open === true) setOpen(false)
    const resp = await patchOrganisationTable({
      id,
      data: {
        ror_id
      },
      token
    })
    if (resp.status === 200) {
      // debugger
      resetField('ror_id', {
        defaultValue:ror_id
      })
    }
  }

  function showButton() {
    if (loading) {
      return <CircularProgress color="primary" size={32} />
    }
    return (
      <IconButton
        title="Find in ROR database using organisation name"
        // color='primary'
        disabled={name ? false : true}
        onClick={FindRorOrganisation}
      >
        <FindReplaceIcon />
      </IconButton>
    )
  }

  return (
    <div className="flex items-center">
      <AutosaveOrganisationTextField
        organisation_id={id}
        options={{
          name: 'ror_id',
          label: config.ror_id.label,
          useNull: true,
          defaultValue: ror_id,
          helperTextMessage: config.ror_id.help,
          helperTextCnt: `${ror_id?.length || 0}/${config.ror_id.validation.maxLength.value}`,
        }}
        rules={config.ror_id.validation}
      />
      <div className="w-[3rem]">
        {showButton()}
      </div>
      <RorIdOptionsModal
        open={open}
        options={options}
        onSelect={updateValue}
      />
    </div>
  )
}
