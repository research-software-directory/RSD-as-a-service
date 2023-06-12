// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Based on official setup for next from MUI5
 * https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript
 */
import createCache from '@emotion/cache'

export default function createEmotionCache(nonce?:string) {
  return createCache({
    key: 'css',
    // https://mui.com/material-ui/guides/content-security-policy/
    nonce,
    prepend: false
  })
}
