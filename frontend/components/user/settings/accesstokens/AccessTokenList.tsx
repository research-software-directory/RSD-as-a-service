// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import {AccessToken} from './apiAccessTokens'
import ContentLoader from '~/components/layout/ContentLoader'

type AccessTokenListProps=Readonly<{
  tokens: AccessToken[],
  onDelete: (token:AccessToken)=>Promise<void>,
  loading: boolean
}>
export default function AccessTokenList({tokens, onDelete, loading}:AccessTokenListProps) {

  if (loading) return <ContentLoader />

  if (tokens.length === 0) return (
    <div className="pt-4">
      <Alert severity="info">
        No active tokens.
      </Alert>
    </div>
  )

  return (
    <List>
      {tokens.map(token => {
        // compare dates
        const expiresAt = new Date(token.expires_at)
        const now = new Date()
        // construct expiration message
        let daysMsg = `Expires on ${expiresAt.toLocaleString()}`
        if (now > expiresAt){
          daysMsg = `EXPIRED on ${expiresAt.toLocaleString()}`
        }
        return (
          <ListItem
            key={token.id}
            disableGutters
            secondaryAction={
              <IconButton
                title="Delete access token"
                onClick={() => onDelete(token)}
              >
                <DeleteIcon/>
              </IconButton>
            }
          >
            <ListItemText
              primary={token.display_name}
              secondary={
                <>
                  <span className={`tracking-widest ${now > expiresAt ? 'text-error font-medium' : 'text-success'}`}>{daysMsg}</span><br/>
                  <span>{token.id}</span>
                </>
              }
            />
          </ListItem>
        )
      })}
    </List>
  )
}
