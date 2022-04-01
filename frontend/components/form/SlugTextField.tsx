import MuiTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import {styled} from '@mui/material/styles'
import {CircularProgress} from '@mui/material'

const TextField = styled(MuiTextField)(({theme}) => ({
  width: '100%',
  '& .MuiInputLabel-root': {
    left:'-4px',
    top:'-4px',
    backgroundColor: theme.palette.background.default,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    border:`1px solid ${theme.palette.divider}`
    // color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root': {
    paddingLeft: 0,
  },
  '& .MuiInputAdornment-root': {
    backgroundColor: theme.palette.grey[100],
    padding: '1.75rem 0rem 1.75rem 1rem',
    borderTopLeftRadius: theme.shape.borderRadius + 'px',
    borderBottomLeftRadius: theme.shape.borderRadius + 'px',
    marginRight:0
  },
}))

type SlugFieldProps = {
  label:string,
  baseUrl: string,
  value: string,
  // register: any,
  error?: boolean,
  helperTextMessage?: string,
  loading: boolean,
  onSlugChange:(value:string)=>void
}

export default function SlugTextField({
  label, baseUrl, value, error, helperTextMessage, loading = true, onSlugChange
}: SlugFieldProps) {

  return (
    <TextField
      autoComplete='off'
      label={label}
      variant='outlined'
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {baseUrl}
          </InputAdornment>
        ),
        endAdornment: (
          loading ?
            <div>
              <CircularProgress data-testid="slug-circular-progress" color="primary" size={32} />
            </div>
          : null
        )
      }}
      error={error ?? false}
      helperText={helperTextMessage}
      onChange={({target})=>onSlugChange(target.value)}
    />
  )
}
