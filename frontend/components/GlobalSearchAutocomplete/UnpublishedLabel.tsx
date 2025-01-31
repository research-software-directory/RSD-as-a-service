// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function UnpublishedLabel({is_published}:Readonly<{is_published?:boolean}>) {
  if (is_published===false){
    return (
      <div className="flex-nowrap text-warning text-xs">
        Unpublished
      </div>
    )
  }
  return null
}
