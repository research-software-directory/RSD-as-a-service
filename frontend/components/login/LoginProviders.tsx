// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'

import {Provider} from 'pages/api/fe/auth'
import useRsdSettings from '~/config/useRsdSettings'

type LoginProvidersProps=Readonly<{
  providers: Provider[]
  login_info_url?:string
}>

function SecondaryProviderText({provider}:Readonly<{provider:Provider}>){
  const {host} = useRsdSettings()

  if (provider?.html && host.email && provider?.accessType==='INVITE_ONLY'){
    return (
      <>
        <span
          dangerouslySetInnerHTML={{__html: provider.html}}
        />
        <span> Contact us at {host.email} for the invitation.</span>
      </>
    )
  }
  if (provider?.html){
    return (
      <span
        dangerouslySetInnerHTML={{__html: provider.html}}
      />
    )
  }
  if (host.email && provider?.accessType==='INVITE_ONLY'){
    return (
      <span> Contact us at {host.email} for the invitation.</span>
    )
  }
  return null
}

export default function LoginProviders({providers,login_info_url}:LoginProvidersProps) {

  return (
    <>
      <List>
        {providers.map(provider => {
          // determine chip color
          let color = 'default'
          if (provider?.accessType==='EVERYONE') color='success'
          if (provider?.accessType==='INVITE_ONLY') color='warning'
          if (provider?.accessType==='DISABLED') color='error'
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
                  },
                  position:'relative'
                }}
              >
                {
                  provider?.accessType==='INVITE_ONLY' ?
                    <Chip
                      size='small'
                      label={'INVITE ONLY'}
                      color={color as any}
                      sx={{
                        minWidth:'6rem',
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.25rem',
                        borderRadius: '0.25rem'
                      }}
                    />
                    : null
                }
                <ListItemText
                  primary={provider.name}
                  secondary={<SecondaryProviderText provider={provider} />}
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
