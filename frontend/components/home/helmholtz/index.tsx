// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {HomeProps} from '~/app/page'

export default function HelmholtzHome({counts,news}: HomeProps) {
  return (
    <main className="flex-1 flex flex-col bg-base-100" data-testid="rsd-helmholtz-home">
      <h1 className='mx-auto mt-12'>Helmholtz homepage placeholder</h1>
      <pre className="container mx-auto p-8 overflow-hidden text-wrap">{JSON.stringify(counts,null,2)}</pre>
      <pre className="container mx-auto p-8 overflow-hidden text-wrap">{JSON.stringify(news,null,2)}</pre>
    </main>
  )
}
