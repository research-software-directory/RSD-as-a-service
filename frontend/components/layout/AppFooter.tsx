import Container from '@mui/material/Container'
import Typography from "@mui/material/Typography"
import Copyright from "./Copyright"
import styled from '@mui/system/styled'

const Footer = styled('footer')(({theme})=>({
  display: 'flex',
  width:' 100%',
  padding: '4rem 0rem',
  fontSize: '2rem',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}))

export default function AppFooter() {
  return (
    <Footer>
      <Container
        component="section"
        maxWidth="hd"
      >
        <Copyright />
      </Container>
    </Footer>
  )
}