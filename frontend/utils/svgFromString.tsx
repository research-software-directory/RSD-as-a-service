// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import SvgIcon from '@mui/material/SvgIcon'

export default function svgFromString(svgString: string) {
  return <SvgIcon>
    <svg dangerouslySetInnerHTML={{__html: svgString}} />
  </SvgIcon>
}
