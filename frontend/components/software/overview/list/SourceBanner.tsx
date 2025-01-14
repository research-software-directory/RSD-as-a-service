// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import OpenInNewIcon from '@mui/icons-material/OpenInNew'

type SourceRSDType = Readonly<{
  source?:string|null,
  domain?:string|null
}>

export default function SourceBanner({source,domain}:SourceRSDType){

  if (!source) return null

  return (
    <div
      className="flex gap-2 py-1 uppercase font-medium group-hover:px-2 group-hover:bg-primary group-hover:text-primary-content"
    >
      <div
        title={domain ?? source}
        className="line-clamp-1 text-sm tracking-widest uppercase"
      >
        {source}
      </div>
      {
        domain ? <OpenInNewIcon sx={{width:'1.25rem', height: '1.25rem'}} />
          : null
      }
    </div>
  )
}
