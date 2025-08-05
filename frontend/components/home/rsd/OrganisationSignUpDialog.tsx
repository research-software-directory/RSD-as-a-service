// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import {useForm} from 'react-hook-form'

import {home_config,organisationSignUp} from './home_config'
import useRsdSettings from '~/config/useRsdSettings'
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined'

type OrganisationSignUpDialogProps = {
  title: string
  reason?: string
  open: boolean
  onClose: () => void
  initOrg?: string
}

type SignUpOrganisation = {
  name: string,
  organisation: string,
  role: string,
  description: string
}

const inputClasses='mb-4 placeholder:text-base-500 outline-0 p-2 w-full text-sm bg-transparent text-base-100 border border-base-600 rounded-xs'

export default function OrganisationSignUpDialog({
  title, open, onClose, initOrg,
  reason='I would like to add my organisation to RSD!'
}: OrganisationSignUpDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const {host} = useRsdSettings()

  const {register, watch, reset} = useForm<SignUpOrganisation>({
    mode: 'onChange',
    defaultValues: {
      name:'',
      organisation: initOrg ?? '',
      role:'',
      description: ''
    }
  })

  const [name,organisation,role,description] = watch(['name','organisation','role','description'])

  function mailBody(): string | undefined {
    return encodeURIComponent(`Hi RSD team,

    ${reason}

    -------------------------
    Name: ${name}
    Organisation: ${organisation}
    Professional role: ${role}
    -------------------------

    ${description}
  `)
  }


  function closeAndReset() {
    onClose()
    // reset form after all processes settled
    // we need to wait for mailBody function
    setTimeout(() => {
      reset()
    },0)
  }


  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={(e, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          // console.log('do nothing')
        } else {
          closeAndReset()
        }
      }}
      disableEscapeKeyDown
      aria-labelledby="responsive-dialog-title"
    >
      <div className="h-full w-full bg-[#232323] p-6">
        <div className="mx-auto">
          <div className="text-base-100 text-xl mb-4">
            {title}
          </div>
          <div className="text-sm text-[#B7B7B7] pb-4">
            You can find more information about registering your organisation in our <u><a href="/documentation/users/register-organisation/" target="_blank" rel="noreferrer">documentation</a></u>.
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
              className="text-sm text-base-100 border border-base-500 text-opacity-60 rounded-sm px-4 py-1 hover:opacity-90 active:opacity-95"
              onClick={(e) => {
                // stop click propagation
                e.preventDefault()
                // call close and reset fn
                closeAndReset()
              }}>
              Cancel
            </button>
            <a
              role="button"
              type="submit"
              onClick={() => {
                closeAndReset()
              }}
              className="text-sm text-base-100 hover:text-base-100 bg-primary px-4 py-1 rounded-sm hover:opacity-90 active:opacity-95"
              target="_blank"
              rel="noreferrer"
              href={`mailto:${host.email}?subject=${encodeURIComponent(home_config.button.register.label)}&body=${mailBody()}`}
            >
              <MailOutlineOutlined/> Create email *
            </a>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
