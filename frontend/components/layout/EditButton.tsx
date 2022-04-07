import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import {useRouter} from 'next/router'
import {getSlugFromString} from '../../utils/getSlugFromString'

type EditButtonProps = {
  title: string,
  url:string
}

export default function EditButton({title,url}:EditButtonProps) {
  const router = useRouter()
  return (
    <IconButton
      size="large"
      title={title}
      data-testid="edit-button"
      aria-label={title}
      onClick={() => {
        router.push(url)
      }}
    >
      <EditIcon />
    </IconButton>
  )
}
