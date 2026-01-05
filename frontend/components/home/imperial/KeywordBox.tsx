// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {ssrSoftwareUrl} from '~/utils/postgrestUrl'

type KeywordBoxProps = {
  label: string
}

export default function KeywordBox({label}: KeywordBoxProps) {
  const url = ssrSoftwareUrl({keywords: [label]})
  return (
    <div className="bg-secondary text-primary-content p-2 text-center rounded-md">
      <div className="text-lg">
        <Link href={url}>
          {label}
        </Link>
      </div>
    </div>
  )
}
