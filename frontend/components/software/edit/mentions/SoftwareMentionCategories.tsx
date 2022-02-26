import {useContext} from 'react'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import {mentionType,MentionEditType} from '../../../../types/MentionType'
import mentionCountContext from './MentionCountContext'

export default function SoftwareMentionCategories({category,onCategoryChange}:
  {category:MentionEditType,onCategoryChange:(category:MentionEditType) => void}) {
  const {mentionCount} = useContext(mentionCountContext)

  function getBadgeContent(key: string) {
    if (mentionCount && mentionCount[key as MentionEditType]) {
      return mentionCount[key as MentionEditType]
    }
    return 0
  }

  return (
    <List sx={{
      width:['100%']
    }}>
      {Object.keys(mentionCount ?? {}).map((key: string, pos:number) => {
        return (
          <ListItemButton
            key={`step-${pos}`}
            selected={key === category}
            onClick={() => {
              onCategoryChange(key as MentionEditType)
            }}
            sx={{
              padding:'0.5rem 1.5rem 0.5rem 0.5rem'
            }}
          >
            <ListItemText
              primary={
                <span>{mentionType[key as MentionEditType]}</span>
              }
              // secondary={`${items?.length ?? 0} items`}
            />
            <Badge
              showZero={false}
              badgeContent={getBadgeContent(key)}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  right: '-0.5rem',
                  top: '-0.5rem'
                },
              }}
              ></Badge>
          </ListItemButton>
        )
      })}
    </List>
  )
}
