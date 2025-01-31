// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function NoResultsLabel({show}:Readonly<{show:boolean}>) {

  if (show){
    return (
      <div className="px-4 py-3 font-normal bg-base-200 mb-2 ">
        <span className="animate-pulse">No results...</span>
      </div>
    )
  }

  return null
}
