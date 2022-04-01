import styled from '@mui/system/styled'

type GridProps = {
  minWidth?: string,
  maxWidth?: string,
  minHeight?: string,
  maxHeight?: string
}

export const FlexibleGridSection = styled('section', {
  // do not forward this props to html element
  // there are for interal use
  shouldForwardProp: (prop) => prop !== 'minWidth' && prop !== 'minHeight' && prop !== 'maxWidth' && prop !== 'maxHeight'
})
  <GridProps>(({theme, minWidth, maxWidth, minHeight, maxHeight}) => {
  // basic definitions
  const props:any = {
    display: 'grid',
    width: '100%',
    // gridGap: '1rem',
    flexWrap: 'wrap',
    // padding: '1rem 0rem 1rem 0rem',
    alignItems: 'stretch',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  }
  // dynamic grid-template-rows
  if (minHeight && maxHeight) {
    props['gridTemplateRows'] = `repeat(auto-fit, minmax(${minHeight ?? '5rem'}, ${maxHeight ?? '7rem'}))`
  }
  // dynamic grid-template-columns
  if (minWidth && maxWidth) {
    props['gridTemplateColumns'] = `repeat(auto-fit, minmax(${minWidth}, ${maxWidth ?? '7rem'}))`
  }
  return props
})

export default FlexibleGridSection
