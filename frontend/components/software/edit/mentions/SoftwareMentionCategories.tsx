import {useEffect, useState} from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {mentionType,MentionType} from '../../../../types/MentionType'

export default function SoftwareMentionCategories({category,itemCount=0,onCategoryChange}:
  {category:MentionType,itemCount:number,onCategoryChange:(category:MentionType) => void}) {

  return (
    <List sx={{
        width:['100%','100%','15rem']
      }}>
        {Object.keys(mentionType).map((key: string, pos:number) => {
          return (
            <ListItemButton
              key={`step-${pos}`}
              selected={key === category}
              onClick={() => {
                onCategoryChange(key as MentionType)
              }}
            >
              <ListItemText
                primary={
                  <span>{mentionType[key as MentionType]} {itemCount}</span>
                }
                // secondary={`${items?.length ?? 0} items`}
              />
              {/* <ListItemIcon>
                Icon here
              </ListItemIcon> */}
            </ListItemButton>
          )
        })}
      </List>
  )
}
