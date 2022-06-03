// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function HelperTextWithCounter({message,count}:{message:string|undefined,count:string}) {
  return (
    <>
      <span className="mr-2">{message}</span>
      <span>{count}</span>
    </>
  )
}
