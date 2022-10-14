import CaretIcon from '~/components/icons/caret.svg'
import * as React from 'react'
import Popover from '@mui/material/Popover'
import {useState} from 'react'
import Link from 'next/link'
import {MailOutlineOutlined} from '@mui/icons-material'

export default function FeedbackPanelButton({feedback_email}:{feedback_email:string}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>()
  const [text, setText] = useState('')
  const open = Boolean(anchorEl)
  const id = open ? 'feedback-popover' : undefined


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const closeAndClean = async () => {
    setAnchorEl(null)
    setTimeout(() => {
      setText('')
    },0)
  }

  function mailBody() {
    if (typeof location === 'undefined') return
    const body = encodeURIComponent(`Hi RSD Team,
      I would like to give some feedback about the RSD on the page ${location.href}:
      ---
      ${text}
      ---`
    )
    return body
  }

  return (
    <div>
      <button className="flex gap-2 items-center" aria-describedby={id} onClick={handleClick}>
        Feedback <CaretIcon/> {open}
      </button>
      <Popover
        className="mt-2"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
         anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="h-full w-full max-w-[300px] bg-[#232323] p-3">
          <textarea
            autoFocus
            className="placeholder:text-gray-500 outline-0 p-2 w-full h-28 text-sm bg-transparent text-white border border-gray-600 rounded"
            placeholder="Ideas on how to improve this page or report an issue?" value={text}
            onChange={e => setText(e.target.value)}>

          </textarea>
          <div className="flex justify-between w-full my-2">
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
          <div className="text-sm my-4 text-[#B7B7B7]">
            We will send your feedback using your default email application,
            or you can open a new <a className="text-primary"
                      href="https://github.com/research-software-directory/RSD-as-a-service/issues"
                      target="_blank" rel="noreferrer">
            issue</a>
          </div>
        </div>
      </Popover>
    </div>
  )
}
