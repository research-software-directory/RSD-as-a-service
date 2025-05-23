// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import {AccessToken} from './apiAccessTokens'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {daysDiff} from '~/utils/dateFn'
import ContentLoader from '~/components/layout/ContentLoader'

type AccessTokenListProps=Readonly<{
  tokens: AccessToken[],
  onDelete: (token:AccessToken)=>Promise<void>,
  loading: boolean
}>
export default function AccessTokenList({tokens, onDelete, loading}:AccessTokenListProps) {
  const {showErrorMessage, showInfoMessage} = useSnackbar()

  if (tokens.length === 0) return null

  if (loading) return <ContentLoader />

  return (
    <List>
      {tokens.map(token => {
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
              secondary={`expires in ${daysDiff(new Date(token.expires_at), 'until')} days`}
            />
          </ListItem>
        )
      })}
    </List>
  )
}
