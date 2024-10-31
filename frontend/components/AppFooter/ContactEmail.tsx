// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Mail from '@mui/icons-material/Mail'

export default function ContactEmail({email, headers}:{email?:string, headers?:string[]}) {
  if (email) {
    let mailTo = email
    if (headers && headers.length > 0) {
      const encodedHeaders: string[] = []
      headers.forEach(d => encodedHeaders.push(encodeURIComponent(d)))
      mailTo += '?' + headers.join('&')
    }
    return (
      <div className="mt-8">
        {/* <div className="mt-4 text-lg">Questions or comments?</div> */}
        <a href={`mailto:${mailTo}`}
          className="flex text-accent hover:text-accent-content"
        >
          <Mail className="mr-2"/> {email}
        </a>
      </div>
    )
  }
  return null
}
