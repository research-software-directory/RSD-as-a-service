// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled'

const SingleLineTitle = styled('h2')<any>(({theme,sx})=>({
  flex: 1,
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  ...sx
}))

export default SingleLineTitle
