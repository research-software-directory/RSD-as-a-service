// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export function maxText({text, maxLen = 100, dots=true}:
{text: string|null, maxLen?: number, dots?: boolean}) {
  try {
    if (text===null) return null
    // return complete content if smaller than max
    if (text.length < maxLen) return text
    const returnText = text.slice(0, maxLen)
    if (dots) {
      return `${returnText}...`
    }
    return returnText
  } catch {
    // on error return received
    return text
  }
}
