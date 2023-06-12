// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function HelperTextWithCounter({message,count}:{message:string|undefined|JSX.Element,count:string}) {
  return (
    <>
      <span className="mr-2">{message}</span>
      <span>{count}</span>
    </>
  )
}
