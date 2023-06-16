// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs/promises'


export function generateFileName(input: string) {
  const fileName = input
    .replaceAll(':', '_')
    .replaceAll(' ', '_')
    .replaceAll('/', '_')
    .replaceAll('.', '_')
    .toLowerCase()

  return fileName
}


export async function saveFile(filename: string, data: string) {
  try {
    console.log('save file...', filename)
    fs.writeFile(filename, data)
  } catch (e) {
    console.log(`saveFile...failed...${e.message}`)
  }
}
