// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled'

const IconOverlay = styled('div')(({theme})=>({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  // alignItems: 'center',
  opacity: 0.5,
  pointerEvents: 'none'
}))

export default IconOverlay
