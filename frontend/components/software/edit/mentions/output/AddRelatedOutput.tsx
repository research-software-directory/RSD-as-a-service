// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {newMentionItem} from '~/components/mention/apiEditMentions'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import CreateMentionInfoPanel from '~/components/mention/CreateMentionInfoPanel'
import {cfgMention as config} from './config'

export default function AddRelatedOutput() {
  const {setEditModal} = useEditMentionReducer()

  function onNewItem() {
    const item = newMentionItem()
    setEditModal(item)
  }

  return (
    <>
      <h3 className="pt-4 pb-2 text-lg">{config.newItem.title}</h3>
      <CreateMentionInfoPanel>
        <div className="pt-4">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onNewItem}>
            Create
          </Button>
        </div>
      </CreateMentionInfoPanel>
    </>
  )
}
