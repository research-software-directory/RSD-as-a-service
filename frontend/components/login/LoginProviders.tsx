// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import {Provider} from 'pages/api/fe/auth'

type LoginProvidersProps=Readonly<{
  providers: Provider[]
  login_info_url?:string
}>

export default function LoginProviders({providers,login_info_url}:LoginProvidersProps) {
  return (
    <>
      <List>
        {providers.map(provider => {
          return (
            <Link
              key={provider.redirectUrl}
              href={provider.redirectUrl}
              passHref
            >
              <ListItem
                alignItems="flex-start"
                className="rounded-[0.25rem] border my-2"
                sx={{
                  opacity: 0.75,
                  '&:hover': {
                    opacity: 1,
                    backgroundColor:'background.default'
                  }
                }}
              >
                <ListItemText
                  primary={provider.name}
                  secondary={provider?.html ?
                    <span
                      dangerouslySetInnerHTML={{__html: provider.html}}
                    />
                    : null
                  }
                  sx={{
                    '.MuiListItemText-primary': {
                      color:'primary.main',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      letterSpacing: '0.125rem'
                    }
                  }}
                />
              </ListItem>
            </Link>
          )
        })}
      </List>
      {login_info_url ?
        <p className="text-base-content-disabled text-sm">
        You can find more information on signing in to the RSD in our <a href={login_info_url} target="_blank" rel="noreferrer"><strong>documentation</strong></a>.
        </p>
        : null
      }
    </>
  )
}
