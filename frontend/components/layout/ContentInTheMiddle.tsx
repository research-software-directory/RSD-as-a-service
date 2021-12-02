import styled from '@mui/system/styled'

const StyledArticle = styled('article')(({theme})=>({
  position:'fixed',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  minWidth:'100vw',
  minHeight:'100vh'
}))

export default function ContentInTheMiddle({children,...props}:{children:any}) {
  return (
    <StyledArticle {...props}>
      {children}
    </StyledArticle>
  )
}