// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Tab, {TabProps} from '@mui/material/Tab'

type TabAsLinkProps = TabProps & {
  href: string
  scroll?: boolean
}

export default function TabAsLink(props:TabAsLinkProps) {

  // console.group('TabAsLink')
  // console.log('props...',props)
  // console.groupEnd()

  return (
    // NOTE! scroll feature is not part of MUI Tab props.
    // The scroll feature works ONLY with Next Link component because Tab
    // passes this property (prop spread) to a Link component without any checks.
    <Tab
      LinkComponent={Link}
      scroll={props?.scroll ?? false}
      {...props}
    />
  )
}
