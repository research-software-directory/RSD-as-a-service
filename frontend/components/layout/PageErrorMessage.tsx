// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ContentInTheMiddle from './ContentInTheMiddle'

type PageErrorMessageProps=Readonly<{
  message:string,
  status?:number,
  children?:any
}>

export default function PageErrorMessage({
  message = 'Failed to process you request',
  status = 500,
  children
}:PageErrorMessageProps) {
  return (
    <ContentInTheMiddle>
      <section className="flex justify-center items-center text-secondary">
        <h1 className="border-r-2 px-4 font-medium">{status}</h1>
        {children || <p className="px-4 tracking-wider">{message}</p>}
      </section>
    </ContentInTheMiddle>
  )
}
