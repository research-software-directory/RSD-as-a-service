import Link from 'next/link'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

import {Provider} from 'pages/api/fe/auth'

type LoginDialogProps = {
  providers: Provider[]
  open:boolean,
  onClose:()=>void
}

export default function LoginDialog({providers,open, onClose}: LoginDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        id="responsive-dialog-title"
        aria-labelledby="responsive-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:'space-between',
          fontSize: '1.75rem'
        }}
      >
        Sign in with
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <>
          <List>
            {providers.map(provider => {
              return (
                <Link
                  key={provider.redirectUrl}
                  href={provider.redirectUrl}
                  passHref
                >
                <a>
                  <ListItem
                    alignItems="flex-start"
                    className="rounded-[0.25rem] border outline-1 my-2"
                    sx={{
                      opacity: 0.75,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor:'background.default'
                      }
                    }}
                  >
                    <ListItemText
                      primary={provider.name}
                      secondary={provider?.html ?
                        <span
                          dangerouslySetInnerHTML={{__html: provider.html}}
                        />
                        : null
                      }
                      sx={{
                        '.MuiListItemText-primary': {
                          color:'primary.main',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          letterSpacing: '0.125rem'
                        }
                      }}
                    />
                  </ListItem>
                </a>
                </Link>
              )
            })}
          </List>
          <span className="italic text-gray-600">
          <q>Somewhere, something incredible is waiting to be known.</q>
          </span> - Carl Sagan
        </>
      </DialogContent>
    </Dialog>
  )
}
