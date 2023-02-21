// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function UnderlinedTitle({title}: { title: string }) {
  return (
    <>
      <div className="pt-2 text-base-content-secondary">{title}</div>
      <hr className="pb-2" />
    </>
  )
}
