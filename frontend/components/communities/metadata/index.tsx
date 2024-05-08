// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import Links, {LinksProps} from '~/components/organisation/metadata/Links'
import { useCommunityContext } from '../context'
import CommunityLogo from './CommunityLogo'

export default function CommunityMetadata() {
  const {id,name,logo_id,isMaintainer,short_description} = useCommunityContext()

  return (
    <section className="grid  md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-4">
      <BaseSurfaceRounded className="flex justify-center p-8 overflow-hidden relative">
        <CommunityLogo
          id={id ?? ""}
          name={name ?? ""}
          logo_id={logo_id ?? null}
          isMaintainer={isMaintainer}
        />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="grid lg:grid-cols-[3fr,1fr] lg:gap-8 xl:grid-cols-[4fr,1fr] p-4">
        <div>
          <h1
            title={name}
            className="text-xl font-medium line-clamp-1">
            {name}
          </h1>
          <p className="text-base-700 line-clamp-3 break-words py-4">
            {short_description}
          </p>
        </div>
        {/* <div className="flex flex-col gap-4">
          <Links links={links} />
        </div> */}
      </BaseSurfaceRounded>
    </section>
  )
}
