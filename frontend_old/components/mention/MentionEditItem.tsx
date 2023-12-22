// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MentionItemBase from './MentionItemBase'
import {MentionItemProps} from '~/types/Mention'
import MentionEditButtons from './MentionEditButtons'

type MentionListItem = {
  pos: number
  item: MentionItemProps
}

export default function MentionEditItem({item, pos}: MentionListItem) {
  return (
    <MentionItemBase
      item={item}
      pos={pos}
      nav={
        <MentionEditButtons item={item}/>
      }
      role="list"
    />
  )
}
