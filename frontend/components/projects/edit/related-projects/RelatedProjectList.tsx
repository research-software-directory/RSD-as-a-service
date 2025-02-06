// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'

import {maxText} from '~/utils/maxText'
import {getImageUrl} from '~/utils/editImage'
import {OrganisationStatus} from '~/types/Organisation'

type RelatedProjectProps = {
  slug: string
  title: string
  subtitle: string | null
  image_id: string | null
  status: OrganisationStatus
}

type ProjectListProps = {
  projects: RelatedProjectProps[] | undefined
  onRemove:(pos:number)=>void
}

type ProjectItemProps = {
  project: RelatedProjectProps
  onDelete:()=>void
}

// list item & alert height
const itemHeight='6rem'

export default function RelatedProjectList({projects,onRemove}:ProjectListProps) {

  if (typeof projects == 'undefined') return null

  if (projects.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem',height:itemHeight}}>
        <AlertTitle sx={{fontWeight:500}}>No related projects</AlertTitle>
        Add related projects using <strong>search form!</strong>
      </Alert>
    )
  }

  function renderList() {
    if (typeof projects == 'undefined') return null
    return projects.map((item,pos) => {
      return (
        <RelatedProjectItem
          key={item.slug}
          project={item}
          onDelete={()=>onRemove(pos)}
        />
      )
    })
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}

export function RelatedProjectItem({project, onDelete}: ProjectItemProps) {
  function getStatusIcon() {
    if (project.status !== 'approved') {
      return (
        <div
          title="Waiting on approval"
          className="absolute flex items-center w-[2rem] h-[4rem] bg-primary"
        >
          <LockIcon
            sx={{
              width: '2rem',
              height: '2rem',
              color: 'white'
            }}
          />
        </div>
      )
    }
    return null
  }
  return (
    <ListItem
      data-testid="related-project-item"
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={onDelete}
            sx={{marginRight: '0rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      sx={{
        minHeight:itemHeight,
        // this makes space for buttons
        paddingRight:'5rem',
        // '&:hover': {
        //   backgroundColor:'grey.100'
        // }
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={project.title}
          src={getImageUrl(project.image_id) ?? ''}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {project?.title.slice(0,2).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      {getStatusIcon()}
      <ListItemText
        primary={
          <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">
            {project.title}
          </a>
        }
        secondary={maxText({
          text: project.subtitle
        })
        }
      />
    </ListItem>
  )
}
