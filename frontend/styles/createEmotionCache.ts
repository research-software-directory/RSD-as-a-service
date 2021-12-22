/**
 * Based on official setup for next from MUI5
 * https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript
 */
import createCache from '@emotion/cache'

export default function createEmotionCache() {
  return createCache({key: 'css'})
}
