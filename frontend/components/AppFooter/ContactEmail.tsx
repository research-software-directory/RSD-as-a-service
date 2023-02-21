// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Mail from '@mui/icons-material/Mail'

export default function ContactEmail({email}:{email?:string}) {
  if (email) {
    return (
      <div className="mt-8">
        {/* <div className="mt-4 text-lg">Questions or comments?</div> */}
        <a href={`mailto:${email}`}
          className="flex text-accent hover:text-accent-content"
        >
          <Mail className="mr-2"/> {email}
        </a>
      </div>
    )
  }
  return null
}
