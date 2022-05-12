import {useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

import useSnackbar from '~/components/snackbar/useSnackbar'
import {softwareMaintainerLink} from './useSoftwareMaintainer'

export default function SoftwareMaintainerLink({software,account,token}: { software: string,account:string,token: string }) {
  const {showErrorMessage} = useSnackbar()
  const [magicLink, setMagicLink] = useState(null)

  async function createInviteLink() {
    const resp = await softwareMaintainerLink({
      software,
      account,
      token
    })
    if (resp.status === 201) {
      setMagicLink(resp.message)
    } else {
      showErrorMessage(`Failed to generate maintainer link. ${resp.message}`)
    }
  }
  return (
    <>
    <Button
      sx={{
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center'
      }}
      startIcon={<AutoFixHighIcon />}
      onClick={createInviteLink}
    >
      Generate invite link
    </Button>
    <div className="py-2"></div>
    {
      magicLink ?
        <a
          target="_blank"
          href={`mailto:?subject=Software maintainer invite&body=Please use the link to become software maintainer. \n ${magicLink}`} rel="noreferrer">
          {magicLink}
        </a>
      :
      null
      }
    </>
  )
}
