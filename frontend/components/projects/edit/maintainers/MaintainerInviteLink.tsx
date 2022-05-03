import {useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'


import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {createMaintainerLink} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'

export default function MaintainerInviteLink({project,account,token}: { project: string,account:string,token: string }) {
  const {showErrorMessage} = useSnackbar()
  const [magicLink, setMagicLink] = useState(null)

  async function createInviteLink() {
    const resp = await createMaintainerLink({
      project,
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
    <EditSectionTitle
      title="Invite link"
      subtitle="In case you cannot find, try invite link"
    />
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
          href={`mailto:?subject=Project maintainer invite&body=Please use this link to <a href="${magicLink}">become project maintainer</a>`} rel="noreferrer">
          {magicLink}
        </a>
      :
      null
      }
    </>
  )
}
