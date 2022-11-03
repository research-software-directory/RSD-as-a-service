// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

export default function LatestBadge() {
  return(
    <div className='absolute top-0 right-0 overflow-hidden text-center w-20 h-20'>
      <div className='absolute bg-primary text-primary-content block rotate-45 text-center w-36 -left-6 top-4'>Latest</div>
    </div>
  )
}
