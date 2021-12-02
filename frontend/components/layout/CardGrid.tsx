
import styled from '@mui/system/styled'

const SectionStyled = styled('section')(({theme})=>({
  display:'grid',
  gridTemplateColumns: '1fr',
  gridGap:'1rem',
  padding:'1rem 0rem',
  '@media (min-width: 1024px)':{
    gridTemplateColumns: '1fr 1fr',
  },
  '@media (min-width: 1920px)':{
    gridTemplateColumns: '1fr 1fr 1fr',
  }
}))

export default function CardGrid({children}:{children:any}) {
  return (
    <SectionStyled>
      {children}
    </SectionStyled>
  )
}