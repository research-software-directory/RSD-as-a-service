import styled from '@mui/system/styled'

import {MenuItemType} from '../../config/menuItems'
import {nextRouterWithLink} from '../../utils/nextRouterWithLink'

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
  minWidth: '5rem',
  padding: '0rem 0.5rem',
  textAlign: 'center'
}))

export default function MenuItemLink({item}:{item:MenuItemType}) {
  return (
    <StyledLink
      href={item.path}
      // set active class if route active=true
      className={item.active ? 'active' : ''}
      onClick={(e)=>{
        if (item?.path){
          // if item has path we use
          // next router to navigate
          nextRouterWithLink(e, item?.path)
        } else if(item?.fn){
          // else if the route has function
          // we call the function and provide item itself as param
          item.fn(item)
        }
      }}
    >
      <StyledLabel>
        {item.label}
      </StyledLabel>
    </StyledLink>
  )
}
