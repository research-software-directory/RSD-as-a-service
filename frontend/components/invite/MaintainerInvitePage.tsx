// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import LinkIcon from '@mui/icons-material/Link'

type MaintainerInvitePageProps=Readonly<{
  title: string
  name: string
  button:{
    href:string,
    label: string
  }
}>

export default function MaintainerInvitePage({title,name,button}:MaintainerInvitePageProps) {
  return (
    <>
      <h1 className="flex-1 flex w-full mb-4 md:my-4">{title}</h1>
      <p className="text-lg py-4">
        {
          name ?
            <span>You are now a maintainer of {name}</span>
            : <span>You are now a maintainer</span>
        }

      </p>
      <div className="flex justify-center">
        <Button
          href={button.href}
          variant="contained"
          sx={{
          // we need to overwrite global link styling from tailwind
          // because the type of button is a link (we use href param)
            ':hover':{
              color:'primary.contrastText'
            }
          }}
          startIcon={<LinkIcon />}
        >
          {button.label}
        </Button>
      </div>
    </>
  )
}
