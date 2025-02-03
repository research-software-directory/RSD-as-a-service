// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MuiCategoryIcon from '@mui/icons-material/Category'
import MuiQuestionMarkIcon from '@mui/icons-material/QuestionMark'
import MuiScienceIcon from '@mui/icons-material/Science'

/**
 * Use lower case name of the icon import. For example '@mui/icons-material/QuestionMark' name is questionmark.
 * Additional icons can be added here by importing them from library and extending MuiIconName type.
 */
export type MuiIconName = 'questionmark'|'category'|'science' | 'none'

export default function CategoryIcon({name}:Readonly<{name?:MuiIconName}>) {
  // default is category icon
  if (!name) return <MuiCategoryIcon />

  // select based on name
  switch(name.toLocaleLowerCase()){
    case 'category':
      return <MuiCategoryIcon />
    case 'science':
      return <MuiScienceIcon />
    case 'questionmark':
      return <MuiQuestionMarkIcon />
    case 'none':
      return null
    default:
      return <MuiCategoryIcon />
  }
}
