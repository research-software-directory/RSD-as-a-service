import CaretIcon from '~/components/icons/caret.svg'
import * as React from 'react'
import Popover from '@mui/material/Popover'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {MailOutlineOutlined} from '@mui/icons-material'

export default function FeedbackPanelButton() {
  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>()

  const [text, setText] = useState('')
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'feedback-popover' : undefined

  const handleClose = () => {
    setAnchorEl(null)
  }

  const close = async () => {
    setAnchorEl(null)
    // Not remove the text before sending the email.
    await new Promise(resolve => setTimeout(resolve, 1000)) // 3 sec
    setText('')
  }

  const mailAddress = process.env.NEXT_PUBLIC_FEEDBACK_URL

  const focusArea = useRef(null)

  useEffect(() => {
    async function triggerFocusArea() {
      // wait of the popover to be rendered to focus on the text area
      await new Promise(resolve => setTimeout(resolve, 100)) // 3 sec
      if (open) {
        // @ts-ignore
        focusArea.current?.focus()
      }
    }

    triggerFocusArea()
  }, [open])

  // Don't display the button if the mail address is not defined in the exnvironment
  if(!mailAddress){
    return (<></>)
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
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      >
        <div className="h-full w-full max-w-[300px] bg-[#232323] p-3">
          <textarea
            ref={focusArea}
            className="placeholder:text-gray-500 outline-0 p-2 w-full h-28 text-sm bg-transparent text-white border border-gray-600 rounded"
            placeholder="Ideas on how to improve this page or report an issue?" value={text}
            onChange={e => setText(e.target.value)}>

          </textarea>
          <div className="flex justify-between w-full my-2">
            <button
              className="text-sm text-white border border-gray-500 text-opacity-60 rounded px-3 py-1 hover:opacity-90 active:opacity-95"
              onClick={close}>
              Cancel
            </button>
            <Link rel="noreferrer"
                  href={`mailto:${mailAddress}?subject=Feedback about the RSD&body=
Hi RSD Team,%0D%0D
I would like to give some feedback about the RSD on the page "https://research-software-directory.org${router.asPath}":%0D%0D
---%0D
${text}%0D
---%0D%0D`}
            >
              <a
                onClick={close}
                className="text-sm text-white hover:text-white bg-primary px-3 py-1 rounded hover:opacity-90 active:opacity-95"
                target="_blank"
              >
                <MailOutlineOutlined/> Send feedback
              </a>
            </Link>

          </div>
          <div className="text-sm my-4 text-[#B7B7B7]">
            Have questions or comments? Contact by <a
            className="text-primary"
            href={'mailto:rsd@esciencecenter.nl?subject=Feedback about the RSD'}
            rel="noreferrer"> email </a>
            or see <a className="text-primary"
                      href="https://github.com/research-software-directory/RSD-as-a-service/issues"
                      target="_blank" rel="noreferrer">
            open issues</a>
          </div>
        </div>
      </Popover>
    </div>
  )
}
