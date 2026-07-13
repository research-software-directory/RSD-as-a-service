// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// Verify if URL points to valid browser image.
export default function validateImageSrc(url:string):Promise<boolean>{
  return new Promise((res)=>{
    const img = new Image()
    img.onload = () => res(true)
    img.onerror = () => res(false)
    img.src = url
  })
}
