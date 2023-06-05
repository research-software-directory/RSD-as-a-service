// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined'

import {config,organisationSignUp} from './config'
import useRsdSettings from '~/config/useRsdSettings'
import {useForm} from 'react-hook-form'

type SignUpOrganisation = {
  name: string,
  organisation: string,
  role: string,
  description: string
}

const inputClasses='mb-4 placeholder:text-base-500 outline-0 p-2 w-full text-sm bg-transparent text-base-100 border border-base-600 rounded-sm'

export default function OrganisationSignUp({minWidth = '9rem'}:{minWidth:string}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const {host} = useRsdSettings()
  const [open, setOpen] = useState(false)

  const {register, watch, reset} = useForm<SignUpOrganisation>({
    mode: 'onChange',
    defaultValues: {
      name:'',
      organisation: '',
      role:'',
      description: ''
    }
  })

  const [name,organisation,role,description] = watch(['name','organisation','role','description'])

  // console.group('Organisation Sing Up')
  // console.log('name...', name)
  // console.log('organisation...', organisation)
  // console.log('description...', description)
  // console.groupEnd()

  function mailBody(): string | undefined {
    return encodeURIComponent(`Hi RSD team,

    I would like to add my organisation to RSD!

    -------------------------
    Name: ${name}
    Organisation: ${organisation}
    Professional role: ${role}
    -------------------------

    ${description}
  `)
  }

  function closeAndReset() {
    setOpen(false)
    // reset form after all processes settled
    // we need to wait for mailBody function
    setTimeout(() => {
      reset()
    },0)
  }

  return (
    <>
      <button
        aria-describedby="Sign up button"
        onClick={()=>setOpen(true)}
      >
        <div className="relative group">
          <div
            className="absolute -inset-1 bg-gradient-to-r from-glow-start to-glow-end rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
          <div
            className="flex gap-3 text-base-900 relative px-8 py-3 bg-base-100 ring-1 ring-base-800 rounded leading-none items-center justify-center space-x-2"
            style={{
              minWidth
            }}
          >
            <span className="space-y-2 text-xl font-medium whitespace-nowrap">
              {config.button.register.label}
            </span>
          </div>
        </div>
      </button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="h-full w-full bg-[#232323] p-6">
          <div className="mx-auto">
            <div className="text-base-100 text-xl mb-4">
              {config.button.register.label}
            </div>
            <div className="text-sm text-[#B7B7B7] pb-4">
              You can find more information about registering your organisation in our <u><a href="https://research-software-directory.github.io/documentation/register-organization.html" target="_blank" rel="noreferrer">documentation</a></u>.
            </div>
            {/* INPUTS */}
            <input type="text"
              autoFocus={true}
              autoComplete="off"
              className={inputClasses}
              placeholder={organisationSignUp.name.label}
              {...register('name')}
            />
            <input type="text"
              autoComplete="off"
              className={inputClasses}
              placeholder={organisationSignUp.organisation.label}
              {...register('organisation')}
            />
            <input type="text"
              autoComplete="off"
              className={inputClasses}
              placeholder={organisationSignUp.role.label}
              {...register('role')}
            />
            <textarea
              rows={5}
              className={inputClasses}
              placeholder={organisationSignUp.description.label}
              {...register('description')}
            >
            </textarea>
            {/* NOTIFICATIONS */}
            <div className="text-sm text-[#B7B7B7] pb-4">
              {organisationSignUp.notification[0]} <br/>
              {organisationSignUp.notification[1]}
            </div>
            {/* NAVIGATION */}
            <div className="flex justify-end items-center gap-4 my-2">
              <button
                className="text-sm text-base-100 border border-base-500 text-opacity-60 rounded px-4 py-1 hover:opacity-90 active:opacity-95"
                onClick={closeAndReset}>
                Cancel
              </button>
              <a
                role="button"
                type="submit"
                onClick={closeAndReset}
                className="text-sm text-base-100 hover:text-base-100 bg-primary px-4 py-1 rounded hover:opacity-90 active:opacity-95"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${host.email}?subject=${encodeURIComponent(config.button.register.label)}&body=${mailBody()}`}
              >
                <MailOutlineOutlined/> Create email *
              </a>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
