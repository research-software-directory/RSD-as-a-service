import styled from '@mui/system/styled'
import {ReactNode} from 'react'

const StyledArticle = styled('article')(({theme})=>({
  flex:1,
  display:'flex',
  justifyContent:'center',
  alignItems:'center'
}))

export default function ContentInTheMiddle({children,...props}:{children:ReactNode,props?:any}) {
  return (
    <StyledArticle
      {...props}
    >
      {children}
    </StyledArticle>
  )
}
