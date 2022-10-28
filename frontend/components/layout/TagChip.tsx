import Chip from '@mui/material/Chip'

export default function TagChip({label, title}:
  { label: string, title?: string }) {

  if (!label) return null

  return (
    <Chip
      title={title ? title : label}
      label={label}
      sx={{
        maxWidth: '21rem',
        borderRadius: '0.125rem',
        textTransform: 'capitalize'
      }}
    />
  )
}
