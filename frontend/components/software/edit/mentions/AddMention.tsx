// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {newMentionItem} from '~/utils/editMentions'
import AddNewItemInfo from './AddNewItemInfo'
import {cfgMention as config} from './config'

export default function AddMention() {
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
          onClick={onNewImpact}>
          add
        </Button>
      </div>
      <AddNewItemInfo />
    </>
  )
}
