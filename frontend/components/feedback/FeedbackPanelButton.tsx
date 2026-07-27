// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Imperial College London
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinkIcon from '@mui/icons-material/Link'
import WebIcon from '@mui/icons-material/Web'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import getBrowser from '~/utils/getBrowser'
import useSmallScreen from '~/config/useSmallScreen'
import CaretIcon from '~/components/icons/caret.svg'

export type FeedbackPanelButtonProps=Readonly<{
  feedback_email: string,
  issues_page_url: string,
  host_label?: string,
  closeFeedbackPanel?: () => void
}>

export default function FeedbackPanelButton({
  feedback_email, issues_page_url,
  host_label='RSD', closeFeedbackPanel
}:FeedbackPanelButtonProps) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const smallScreen = useSmallScreen()

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const closeAndClean = async () => {
    setOpen(false)

    if (closeFeedbackPanel) closeFeedbackPanel()

    setTimeout(() => {
      setText('')
    }, 0)
  }

  function browserNameAndVersion(): string | undefined {
    const browser = getBrowser()
    return `${browser?.name} ${browser?.version}`
  }

  function mailSubject(){
    return encodeURIComponent(`Feedback about ${host_label}`)
  }

  function mailBody(): string | undefined {
    if (typeof location === 'undefined') return

    return encodeURIComponent(`Hi ${host_label} Team,

I would like to give some feedback about the ${host_label} for the browser ${browserNameAndVersion()} on the page ${location.href}:
---
${text}
---

User Agent: ${navigator.userAgent}`
    )
  }

  return (
    <div>
      <button
        data-testid="feedback-button"
        className="flex gap-2 items-center no-underline"
        onClick={handleClickOpen}
      >
        Feedback <CaretIcon/>
      </button>
      { open &&
        <Dialog
          fullScreen={smallScreen}
          open={true}
          onClose={handleClose}
          aria-labelledby="feedback-dialog-title"
        >
          <DialogTitle sx={{border:'0px'}}>
            Send Feedback
          </DialogTitle>
          <DialogContent>
            <div>
              <textarea
                autoFocus
                className="outline-0 p-2 w-full h-28 text-sm border rounded-sm"
                placeholder="Ideas on how to improve this page or report an issue?" value={text}
                onChange={e => setText(e.target.value)}>
              </textarea>
              {/* Location URL */}
              <div className="flex gap-2 text-sm break-all text-base-content-secondary">
                <LinkIcon className="-rotate-45"/> {typeof location !== 'undefined' && location.href}
              </div>
              {/* Browser user agent detection */}
              <div className="flex gap-2 text-sm text-base-content-secondary mt-2">
                <WebIcon/> {browserNameAndVersion()}
              </div>
            </div>
          </DialogContent>
          <Alert severity='info' sx={{
            '.MuiAlert-message':{
              overflow:'visible'
            }
          }}>
            We will send your feedback using your default email application,
            or you can <a className="text-primary" href={issues_page_url} target="_blank" rel="noreferrer"><u>open a new issue</u></a>
          </Alert>
          <DialogActions sx={{border:'0px'}}>
            {/*
              Button order in the default styles is reversed  to achieve following goal:
              First button in the tab order is first button at right side
              */}
            <Button
              color="primary"
              variant="contained"
              endIcon={<MailOutlineOutlined/>}
              disabled={text.length === 0}
              href={`mailto:${feedback_email}?subject=${mailSubject()}&body=${mailBody()}`}
            >
              Send feedback
            </Button>
            <Button
              color="secondary"
              onClick={closeAndClean}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  )
}
