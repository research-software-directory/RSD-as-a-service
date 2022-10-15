import * as React from 'react'
import {useState} from 'react'
import Link from 'next/link'
import {MailOutlineOutlined} from '@mui/icons-material'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import LinkIcon from '@mui/icons-material/Link'

export default function FeedbackPanelButton(
  {feedback_email, closeFeedbackPanel}: { feedback_email: string, closeFeedbackPanel?: () => void }
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

  function mailBody() {
    if (typeof location === 'undefined') return

    return encodeURIComponent(`Hi RSD Team,
      I would like to give some feedback about the RSD on the page ${location.href}:
      ---
      ${text}
      ---`
    )
  }

  return (
    <div className="lg:container lg:mx-auto relative">
      <button
        title="We value your feedback"
        aria-describedby="feedback panel"
        onClick={handleClickOpen}
        className="bg-error text-error-content"
        style={{
          position: 'absolute',
          left:'1rem',
          bottom: '-2rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem 0rem'
        }}
      >
      Your Feedback
      </button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        // disable adding styles to body (overflow:hidden & padding-right)
        disableScrollLock={fullScreen}
      >
        <div className="h-full w-full bg-[#232323] p-5 ">
          <div className="mx-auto max-w-[500px]">
            <div className="text-white text-xl mb-4">
              Your Feedback
            </div>
            <textarea
              autoFocus
              className="placeholder:text-gray-500 outline-0 p-2 w-full h-28 text-sm bg-transparent text-white border border-gray-600 rounded"
              placeholder="Ideas on how to improve this page or report an issue?" value={text}
              onChange={e => setText(e.target.value)}>
          </textarea>

            <div className="text-[#888] text-sm mb-8">
              <LinkIcon className="-rotate-45"/> {typeof location !== 'undefined' && location.href}
            </div>

            <div className="flex justify-end gap-4 w-full my-2">
              <button
                className="text-sm text-white border border-gray-500 text-opacity-60 rounded px-3 py-1 hover:opacity-90 active:opacity-95"
                onClick={closeAndClean}>
                Cancel
              </button>
              <Link rel="noreferrer"
                    href={`mailto:${feedback_email}?subject=Feedback about the RSD&body=${mailBody()}`}
              >
                <a
                  onClick={closeAndClean}
                  className="text-sm text-white hover:text-white bg-primary px-3 py-1 rounded hover:opacity-90 active:opacity-95"
                  target="_blank"
                >
                  <MailOutlineOutlined/> Send feedback
                </a>
              </Link>

            </div>
            <div className="text-sm mt-8 mb-6 text-[#B7B7B7]">
              We will send your feedback using your default email application,
              or you can open a new <a className="text-primary"
                                       href="https://github.com/research-software-directory/RSD-as-a-service/issues"
                                       target="_blank" rel="noreferrer">
              issue</a>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}


