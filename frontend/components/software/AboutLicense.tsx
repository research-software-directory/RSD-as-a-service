// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import AttachFileIcon from '@mui/icons-material/AttachFile'

export default function AboutLicense({license}:{license:string[]}) {

  function renderLicenses() {
    if (license.length === 0) {
      return (<i>Not specified</i>)
    }
    return (
      <ul className="py-1">
        {license.map((item, pos) => {
          return <li key={pos}>{ item }</li>
        })}
      </ul>
    )
  }

  return (
    <>
    <div className="pt-8 pb-2">
        <AttachFileIcon color="primary" sx={{transform:'rotate(45deg)'}} />
      <span className="text-primary pl-2">License</span>
    </div>
    {renderLicenses()}
    </>
  )
}
