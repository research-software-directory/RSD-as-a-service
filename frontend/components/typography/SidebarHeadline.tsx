// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {Icon} from './Icon'

type SidebarHeadlineProps = {
  iconName?: string
  title: string
}
export const SidebarHeadline = ({iconName, title}: SidebarHeadlineProps) => {
  return <div className="pt-8 pb-2">
    {iconName && <Icon color="primary" name={iconName}/>}
    <span className="text-primary pl-2">{title}</span>
  </div>
}
