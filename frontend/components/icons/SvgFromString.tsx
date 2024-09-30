// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import SvgIcon from '@mui/material/SvgIcon'

export default function SvgFromString({svg}:Readonly<{svg:string}>) {

  // Regex to remove 'width' and 'height' attributes
  const svgNoDim = svg.replace(/(width|height)="[^"]*"/g, '')

  return <SvgIcon><g dangerouslySetInnerHTML={{__html: svgNoDim}}/></SvgIcon>
}
