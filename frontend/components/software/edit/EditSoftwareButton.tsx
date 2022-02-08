import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import {useRouter} from 'next/router'

export default function EditSoftwareButton({slug}:{slug:string}) {
  const router = useRouter()
  return (
    <IconButton
      size="large"
      title="Edit software"
      data-testid="edit-software-button"
      aria-label="edit-software"
      onClick={() => {
        router.push(`/software/${slug}/edit`)
      }}
    >
      <EditIcon />
    </IconButton>
  )
}
