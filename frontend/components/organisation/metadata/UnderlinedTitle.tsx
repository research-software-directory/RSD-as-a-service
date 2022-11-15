// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function UnderlinedTitle({title}: { title: string }) {
  return (
    <>
      <h4 className="pt-2 text-base-content-disabled">{title}</h4>
      <hr className="pb-2" />
    </>
  )
}
