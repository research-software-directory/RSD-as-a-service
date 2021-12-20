import {ReactNode} from 'react'
import styled from '@mui/system/styled'
import Alert from '@mui/material/Alert'

const PageTitleStyled = styled("section")(({theme})=>({
  display: 'flex',
  position: 'sticky',
  top: '0rem',
  padding: '1rem 0rem 1rem 0rem',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 9,
  '@media (max-width: 640px)':{
    flexDirection:'column',
    flexWrap: 'wrap',
  },
}))

export default function PageTitle({title,children}:{title:string,children?:ReactNode}) {
  return (
    <PageTitleStyled>
      <h1 className="flex-1 w-full mb-4 md:my-4">{title}</h1>
      <noscript>
        <Alert severity="warning" sx={{margin:'0rem 2rem'}}>
          Limited functionality: Your browser does not support JavaScript.
        </Alert>
      </noscript>
      {children}
    </PageTitleStyled>
  )
}
