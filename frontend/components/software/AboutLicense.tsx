// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import AttachFileIcon from '@mui/icons-material/AttachFile'
import LaunchIcon from '@mui/icons-material/Launch'
import {LicenseForSoftware} from '~/types/SoftwareTypes'

export default function AboutLicense({licenses}:{licenses:LicenseForSoftware[]}) {
  // console.log('AboutLicense...', licenses)
  return (
    <div>
      <div className="pb-2">
        <AttachFileIcon color="primary" sx={{transform:'rotate(45deg)'}} />
        <span className="text-primary pl-2">License</span>
      </div>
      {licenses.length === 0 ?
        <i>Not specified</i>
        :
        <ul className="py-1">
          {licenses.map((item) => {
            return (
              <li key={item.license} title={item.name ?? item.license}>
                { item.reference ?
                  <a href={item.reference} target='_blank' className="flex items-center">
                    {item.license}
                    <LaunchIcon
                      sx={{
                        width:'1rem',
                        height:'1rem',
                        marginLeft: '0.5rem'
                      }}
                    />
                  </a>
                  : <span>{item.license}</span>
                }
              </li>
            )
          })}
        </ul>
      }
    </div>
  )
}
