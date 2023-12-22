// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Link from '@mui/material/Link'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress'

import {ExpandedOrcidResult} from './apiOrcidUsers'

type OrcidUserItemProps={
  orcid:string
  person:ExpandedOrcidResult
  removeOrcid:(orcid:string)=>void
}


export function OrcidInfo({loading,person}:{loading:boolean,person?:ExpandedOrcidResult}){
  if (loading===true) return <CircularProgress size="1rem"/>

  if (typeof person === 'undefined') return null

  if (person['institution-name'] &&
    person['institution-name']?.length > 0){
    return (
      <>
        <span>{`${person['given-names']??''} ${person['family-names']??''}`}</span><br/>
        <span>{`${person['institution-name']?.join('; ')}`}</span><br/>
      </>
    )
  }

  return (
    <span>{`${person['given-names']??''} ${person['family-names']??''}`}</span>
  )
}


export default function OrcidUserItem({orcid,person,removeOrcid}:OrcidUserItemProps){

  return (
    <ListItem
      key={orcid}
      disableGutters
      secondaryAction={
        <IconButton onClick={() => removeOrcid(orcid)}><DeleteIcon/></IconButton>
      }
      sx={{
        borderBottom:'1px solid var(--rsd-base-300,#ccc)'
      }}
    >
      <ListItemText
        primary={
          <Link href={`https://orcid.org/${orcid}`} underline="always" target="_blank" rel="noreferrer">
            {orcid}
          </Link>
        }
        secondary={
          <OrcidInfo
            loading={false}
            person={person}
          />
        }
      />
    </ListItem>
  )
}
