import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright(props:any) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Research Software Directory
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}