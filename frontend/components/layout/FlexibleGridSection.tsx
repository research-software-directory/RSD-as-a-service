// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {styled,useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export type FlexGridProps = {
  minWidth?: string,
  maxWidth?: string,
  minHeight?: string,
  maxHeight?: string,
  height?: string
}
/**
 * Hook that returns adviced cell dimensions to be passed to FlexibleGridSelection
 */
export function useAdvicedDimensions(source:'software'|'project'|'organisation' = 'project') {
  const theme = useTheme()
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery(theme.breakpoints.down('lg'))
  // adjust grid width and height for mobile
  const minWidth = smallScreen ? '18rem' : '26rem'
  let itemHeight = smallScreen ? '26rem' : '18rem'

  if (source === 'software' &&
    itemHeight === '26rem') {
    // software card does not have image
    // it needs less height
    itemHeight = '22rem'
  }

  return {
    minWidth,
    maxWidth:'1fr',
    itemHeight
  }
}


export const FlexibleGridSection = styled('section', {
  // do not forward this props to html element
  // there are for internal use
  shouldForwardProp: (prop) => prop !== 'minWidth' && prop !== 'minHeight' && prop !== 'maxWidth' && prop !== 'maxHeight' && prop !== 'height'
})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <FlexGridProps>(({theme, minWidth, maxWidth, minHeight, maxHeight, height}) => {
  // basic definitions
    const props: any = {
      flex: 1,
      display: 'grid',
      width: '100%',
      // gridGap: '1rem',
      flexWrap: 'wrap',
      // padding: '1rem 0rem 1rem 0rem',
      alignItems: 'stretch',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    // backgroundColor: theme.palette.background.paper,
    // overflow: 'auto'
    }
    if (height) {
    // dynamic grid-auto-rows
      props['gridAutoRows'] = height
    }else if (minHeight && maxHeight) {
    // dynamic grid-auto-rows
      props['gridTemplateRows'] = `repeat(auto-fit,minmax(${minHeight ?? '5rem'}, ${maxHeight ?? '7rem'}))`
    }
    // dynamic grid-template-columns
    if (minWidth && maxWidth) {
      props['gridTemplateColumns'] = `repeat(auto-fit, minmax(${minWidth}, ${maxWidth ?? '7rem'}))`
    }
    return props
  })

export default FlexibleGridSection
