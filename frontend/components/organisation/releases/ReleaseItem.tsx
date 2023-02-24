// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Link from 'next/link'
import {SoftwareReleaseInfo} from './useSoftwareReleases'

export default function ReleaseItem({release}: { release: SoftwareReleaseInfo }) {
  const releaseDate = new Date(release.release_date)
  return (
    <article className="py-2">
      <div className="flex gap-4">
        {/* release date */}
        <div className="text-base-content-secondary whitespace-nowrap font-mono tracking-tighter text-sm leading-6">{
          releaseDate.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        <div className='flex-1'>
          {/* name and version */}
          <div className="flex flex-wrap gap-4 justify-between">
            <Link
              title="Link to RSD page"
              href={`/software/${release.software_slug}`}
              target="_blank"
              passHref
            >
              {release.software_name}
              <OpenInNewIcon sx={{
                height: '1rem',
                width: '1rem',
                marginLeft: '0.5rem'
              }} />
            </Link>
            <Link
              href={`https://doi.org/${release.release_doi}`}
              target="_blank"
              passHref
            >
            <Chip
              title="Link to DOI page"
              label={release.release_tag ?? 'v?.?.?'}
              icon={<OpenInNewIcon />}
              size="small"
              clickable
              sx={{
                maxWidth: '15rem',
                borderRadius: '0rem 0.5rem',
                // textTransform: 'capitalize',
                '& .MuiChip-icon': {
                  order: 1,
                  margin:'0rem 0.25rem 0rem 0rem',
                  height: '1rem',
                  width: '1rem'
                }
              }}
            />
            </Link>
          </div>
          {/* authors, contributors */}
          {release.release_authors?.length > 0 ?
            <div className="text-sm text-base-content-secondary pt-1">{ release.release_authors}</div>
            : null
          }
          {/* DOI */}
          <div className="text-sm text-base-content-secondary pt-1">
            DOI: {release.release_doi}
          </div>
        </div>
      </div>
    </article>
  )
}
