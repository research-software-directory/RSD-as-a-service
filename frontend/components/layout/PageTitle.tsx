import {ReactNode} from 'react'
import styled from '@mui/system/styled'

export const PageTitleSticky = styled('section')(({theme})=>({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'sticky',
  top: '0rem',
  padding: '1rem 0rem',
  alignItems: 'center',
  // borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 9,
  '@media (max-width: 640px)':{
    flexDirection:'column',
    flexWrap: 'wrap',
  },
}))

export default function PageTitle({title,children}:{title:string,children?:ReactNode}) {
  return (
    <PageTitleSticky>
      <h1 className="flex-1 w-full mb-4 md:my-4">{title}</h1>
      {children}
    </PageTitleSticky>
  )
}
