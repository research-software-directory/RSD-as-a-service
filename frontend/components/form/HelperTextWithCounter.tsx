// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

export default function HelperTextWithCounter({message,count}:{message:string|undefined|JSX.Element,count:string}) {
  return (
    <>
      <span className="mr-2">{message}</span>
      <span>{count}</span>
    </>
  )
}
