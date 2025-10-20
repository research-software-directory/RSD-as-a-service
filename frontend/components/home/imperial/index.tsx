// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {HomeProps} from 'app/page'
import MainContentImperialCollege from './MainContentImperialCollege'

export default function ImperialCollegeHome({counts,news}: HomeProps) {
  return (
    <main className="flex-1 flex flex-col text-secondary-content bg-[url('/images/imperial_bg.png')] bg-cover bg-no-repeat bg-center bg-scroll bg-base-100">
      <MainContentImperialCollege counts={counts} news={news}/>
    </main>
  )
}
