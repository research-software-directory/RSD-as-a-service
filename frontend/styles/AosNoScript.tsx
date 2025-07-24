// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Add support for graceful fallback for aos animations when js is disabled
   NOTE! we use nonce to cover security audit
 * @returns
 */
export default function AosNoScript({nonce}:{nonce:string}) {
  return (
    <noscript dangerouslySetInnerHTML={{__html: `
      <style
        nonce="${nonce}"
        type="text/css">
        [data-aos] {
          opacity: 1 !important;
          transform: translate(0) scale(1) !important;
        }
      </style>
    `}} />
  )
}
