// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import AddNewItemInfo from '~/components/software/edit/mentions/AddNewItemInfo'
import {newMentionItem} from '~/utils/editMentions'
import {cfgImpact as config} from './config'

export default function AddImpact() {
  const {setEditModal} = useEditMentionReducer()

  function onNewImpact() {
    const item = newMentionItem()
    setEditModal(item)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <EditSectionTitle
            title={config.newItem.title}
            subtitle={config.newItem.subtitle}
          />
        </div>
        <div className="px-4"></div>
        <Button
          startIcon={<AddIcon />}
          onClick={onNewImpact}>
          Add
        </Button>
      </div>
      <AddNewItemInfo />
    </>
  )
}
