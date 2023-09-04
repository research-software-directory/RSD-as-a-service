// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import CategoryIcon from '@mui/icons-material/Category'
import ScienceIcon from '@mui/icons-material/Science'

import type SvgIcon from '@mui/material/SvgIcon'

// FIXME: This is a workaround before we can load icons dynamically (see #975)
// create a component map with lowercase icon names as index
const iconMap = [
  QuestionMarkIcon,
  CategoryIcon,
  ScienceIcon,
].reduce((map, item)=>{
  // magically generate icon name
  // @ts-expect-error
  const id = item.type.render.displayName.toLowerCase().slice(0, -4)
  map[id] = item
  return map
},{} as Record<string, typeof SvgIcon>)


type IconProps = {
  name: string
} & React.ComponentProps<typeof SvgIcon>

export const Icon = ({name, ...props} : IconProps) => {
  const MuiIcon = (name && iconMap[name.toLowerCase()]) || QuestionMarkIcon
  return <MuiIcon {...props} />
}


