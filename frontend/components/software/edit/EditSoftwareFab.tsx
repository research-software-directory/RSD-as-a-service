import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/Edit'
import {useRouter} from 'next/router'

export default function EditSoftwareFab({isMaintainer, slug}:
  { isMaintainer: boolean, slug: string }) {
  const router = useRouter()
  if (isMaintainer===true) {
    return (
      <Fab
        title="Edit software"
        color="primary"
        aria-label="edit"
        size="medium"
        sx={{
          position: 'fixed',
          right: '4rem',
          bottom: '4rem'
        }}
        onClick={() => {
          router.push(`/software/${slug}/edit`)
        }}
      >
        <EditIcon />
      </Fab>
    )
  }
  return null
}
