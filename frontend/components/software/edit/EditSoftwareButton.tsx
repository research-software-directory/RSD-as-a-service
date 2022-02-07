import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import {useRouter} from 'next/router'

export default function EditSoftwareButton({slug}:{slug:string}) {
  const router = useRouter()
  return (
    <IconButton
      size="large"
      title="Edit software"
      data-testid="edit-menu-button"
      aria-label="edit-menu"
      onClick={() => {
        router.push(`/software/${slug}/edit`)
      }}
    >
      <EditIcon />
    </IconButton>
  )
}
