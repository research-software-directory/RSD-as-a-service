// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// import * as React from 'react'
import {useState} from 'react'
import {MailOutlineOutlined} from '@mui/icons-material'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import LinkIcon from '@mui/icons-material/Link'
import WebIcon from '@mui/icons-material/Web'
import Divider from '@mui/material/Divider'
import CaretIcon from '~/components/icons/caret.svg'
import getBrowser from '~/utils/getBrowser'

export default function FeedbackPanelButton({feedback_email, issues_page_url, closeFeedbackPanel}:
  { feedback_email: string, issues_page_url: string, closeFeedbackPanel?: () => void }
) {

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const closeAndClean = async () => {
    setOpen(false)
    closeFeedbackPanel && closeFeedbackPanel()

    setTimeout(() => {
      setText('')
    }, 0)
  }

  function browserNameAndVersion(): string | undefined {
    const browser = getBrowser()
    return `${browser?.name} ${browser?.version}`
  }

  function mailBody(): string | undefined {
    if (typeof location === 'undefined') return

    return encodeURIComponent(`Hi RSD Team,

I would like to give some feedback about the RSD for the browser ${browserNameAndVersion()} on the page ${location.href}:
---
${text}
---

User Agent: ${navigator.userAgent}`
    )
  }

  return (
    <div>
      {/* If desktop size */}
      <button className="hidden md:flex gap-2 items-center no-underline"
        onClick={handleClickOpen}
      >
        Feedback <CaretIcon/>
      </button>
      {/*If  mobile size */}
      <div className="block md:hidden">
        <Divider/>
        <button className="flex md:hidden w-full py-2 px-4"
          onClick={handleClickOpen}>
          Send feedback
        </button>
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="h-full w-full bg-base-700 p-5 ">
          <div className="mx-auto max-w-[500px]">
            <div className="text-base-100 text-xl mb-4">
              Send Feedback
            </div>
            <textarea
              autoFocus
              className="placeholder:text-base-500 outline-0 p-2 w-full h-28 text-sm bg-base-700 text-base-100 border border-base-600 rounded"
              placeholder="Ideas on how to improve this page or report an issue?" value={text}
              onChange={e => setText(e.target.value)}>
            </textarea>

            {/* Location URL */}
            <div className="text-[#888] text-sm break-all">
              <LinkIcon className="-rotate-45"/> {typeof location !== 'undefined' && location.href}
            </div>
            {/* Browser user agent detection */}
            <div className="text-[#888] text-sm mb-8">
              <WebIcon/> {browserNameAndVersion()}
            </div>

            <div className="flex justify-end gap-4 w-full my-2">
              <button
                className="text-sm text-base-200 border border-base-400 opacity-60 rounded px-3 py-1 hover:opacity-90 active:opacity-95"
                onClick={closeAndClean}>
                Cancel
              </button>
              <a
                onClick={closeAndClean}
                className="text-sm text-base-100 hover:text-base-100 bg-primary px-3 py-1 rounded hover:opacity-90 active:opacity-95"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${feedback_email}?subject=${encodeURIComponent('Feedback about the RSD')}&body=${mailBody()}`}
              >
                <MailOutlineOutlined/> Send feedback
              </a>

            </div>
            <div className="text-sm mt-8 mb-6 text-[#B7B7B7]">
              We will send your feedback using your default email application,
              or you can open a new <a className="text-primary" href={issues_page_url} target="_blank" rel="noreferrer">
              issue</a>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}


