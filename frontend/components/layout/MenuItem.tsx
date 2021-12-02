import styled from '@mui/system/styled'

import {MenuItem} from '../../config/menuItems'
import {nextRouterWithLink} from './nextRouterWithLink'

const StyledLink = styled('a')(({theme})=>({
  textDecoration:'none',
  color: theme.palette.secondary.main,
  padding: '0.5rem 0rem',
  borderBottom: '1px transparant',
  ':hover':{
    color: theme.palette.primary.main
  },
  '&.active':{
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  }
}))

const StyledLabel = styled('div')(({})=>({
  minWidth: '7rem',
  textAlign: 'center'
}))

export default function MenuItemLink({item}:{item:MenuItem}) {
  return (
    <StyledLink
      href={item.path}
      className={item.active ? "active" : ""}
      onClick={(e)=>nextRouterWithLink(e, item.path)}
    >
      <StyledLabel>
        {item.label}
      </StyledLabel>
    </StyledLink>
  )
}