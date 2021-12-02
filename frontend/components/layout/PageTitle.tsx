import Typography from '@mui/material/Typography'
import styled from '@mui/system/styled'

const PageTitleStyled = styled("section")(({theme})=>({
  display: 'flex',
  position: 'sticky',
  top: '0rem',
  padding: '1rem 0rem',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: 9,
  '@media (max-width: 768px)':{
    flexDirection:'column',
  },
}))

export default function PageTitle({title,children}:{title:string,children?:any}) {
  return (
    <PageTitleStyled>
      <Typography variant="h1" sx={{flex:1}} color="secondary">
        {title}
      </Typography>
      {children}
    </PageTitleStyled>
  )
}