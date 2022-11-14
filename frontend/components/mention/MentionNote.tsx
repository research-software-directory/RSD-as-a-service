// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function MentionNote({note}: { note: string | null }) {
  if (note) {
    return <div className="mt-2 text-sm opacity-60">{note}</div>
  }
  return null
}
