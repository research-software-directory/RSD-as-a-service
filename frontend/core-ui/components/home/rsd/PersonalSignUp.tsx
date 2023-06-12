// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined'

import {config,personalSignUp} from './config'
import useRsdSettings from '~/config/useRsdSettings'
import {useForm} from 'react-hook-form'

type SignUpForm = {
  name: string,
  affiliation: string,
  role: string,
  orcid: string,
  description:string
}

const inputClasses='mb-4 placeholder:text-gray-500 outline-0 p-2 w-full text-sm bg-transparent text-white border border-gray-600 rounded-sm'

export default function PersonalSignUp({minWidth = '9rem'}:{minWidth:string}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const {host} = useRsdSettings()
  const [open, setOpen] = useState(false)

  const {register, watch, reset} = useForm<SignUpForm>({
    mode: 'onChange',
    defaultValues: {
      name:'',
      affiliation: '',
      role:'',
      orcid: '',
      description: ''
    }
  })

  const [name,affiliation,role,orcid,description] = watch(['name','affiliation','role','orcid','description'])

  // console.group('Personal Sing Up')
  // console.log('name...', name)
  // console.log('affiliation...', affiliation)
  // console.log('orcid...', orcid)
  // console.log('description...', description)
  // console.groupEnd()

  function mailBody(): string | undefined {
    return encodeURIComponent(`Hi RSD team,

    I would like to join RSD!

    -------------------------
    Name: ${name}
    Affiliation: ${affiliation}
    Professional role: ${role}
    ORCID: ${orcid}
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
            className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
          <div
            className="flex gap-3 text-black relative px-8 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none items-center justify-center space-x-2"
            style={{
              minWidth
            }}
          >
            <span className="space-y-2 text-xl font-medium whitespace-nowrap">
              {config.button.signUp.label}
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
            <div className="text-white text-xl mb-4">
              {config.button.signUp.label}
            </div>
            <div className="text-sm text-[#B7B7B7] pb-4">
              You can find more information about how to get access in our <u><a href="https://research-software-directory.github.io/documentation/getting-access.html" target="_blank" rel="noreferrer">documentation</a></u>.
            </div>
            {/* INPUTS */}
            <input type="text"
              autoFocus={true}
              autoComplete="off"
              className={inputClasses}
              placeholder={personalSignUp.name.label}
              {...register('name')}
            />
            <input type="text"
              autoComplete="off"
              className={inputClasses}
              placeholder={personalSignUp.affiliation.label}
              {...register('affiliation')}
            />
            <input type="text"
              autoComplete="off"
              className={inputClasses}
              placeholder={personalSignUp.role.label}
              {...register('role')}
            />
            <input type="text"
              autoComplete="off"
              className={inputClasses}
              placeholder={personalSignUp.orcid.label}
              {...register('orcid')}
            />
            <textarea
              rows={5}
              className={inputClasses}
              placeholder={personalSignUp.description.label}
              {...register('description')}
            >
            </textarea>
            <div className="text-sm text-[#B7B7B7]">

            </div>
            {/* NOTIFICATIONS */}
            <div className="text-sm text-[#B7B7B7] pb-4">
              {personalSignUp.notification[0]} <br/>
              {personalSignUp.notification[1]}
            </div>
            {/* NAVIGATION */}
            <div className="flex justify-end items-center gap-4 my-2">
              <button
                className="text-sm text-white border border-gray-500 text-opacity-60 rounded px-4 py-1 hover:opacity-90 active:opacity-95"
                onClick={closeAndReset}>
                Cancel
              </button>
              <a
                role="button"
                type="submit"
                onClick={closeAndReset}
                className="text-sm text-white hover:text-white bg-primary px-4 py-1 rounded hover:opacity-90 active:opacity-95"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${host.email}?subject=${encodeURIComponent(config.button.signUp.label)}&body=${mailBody()}`}
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
