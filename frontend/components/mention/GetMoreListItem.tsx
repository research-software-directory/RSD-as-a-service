import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

type GetMoreItemsProps={
  show: boolean
  onClick:()=>void
}

export default function GetMoreListItem({show,onClick}:GetMoreItemsProps){

  if (show===false) return null

  return (
    <li
      role="button"
      aria-label="Get more items"
      title="Get more items"
      onClick={onClick}
      className="py-4 px-2 flex justify-center cursor-pointer">
      <PlaylistAddIcon />
    </li>
  )
}
