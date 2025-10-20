// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import WarningIcon from '@mui/icons-material/Warning'

/**
 * This component will show message that Javascript is required if javascript is disabled.
 * The default message is: This page requires JavaScript.
 * In case javascript is enabled this component will be hidden.
 * @param param0
 * @returns
 */
export default function JavaScriptRequiredMsg({
  msg='This page requires JavaScript'
}:Readonly<{msg?:string}>) {
  return (
    <div className="hidden noscript:flex flex-1 flex-col justify-center items-center text-error text-2xl">
      <WarningIcon sx={{height:'3rem',width:'3rem'}} />
      <p>{msg}</p>
    </div>
  )
}
