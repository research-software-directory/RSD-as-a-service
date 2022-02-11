import {
  Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle, useMediaQuery
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'

export default function ConfirmDeleteModal(
  {open,title='Remove',displayName='this item',onCancel,onDelete}:
  {open:boolean,title:string,displayName:string,onCancel:()=>void,onDelete:()=>void}) {
  const smallScreen = useMediaQuery('(max-width:600px)')
  // console.group('DeleteContributorModal')
  // console.log('open...', open)
  // console.log('contributor...', displayName)
  // console.groupEnd()
  return (
    <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={onCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        color: 'secondary.main',
        fontWeight: 500
      }}>
        <WarningIcon
          color="error"
          sx={{
            width: '2rem',
            height: '2rem',
            margin: '0rem 0.5rem 0.25rem 0rem'
          }}
        /> {title}
      </DialogTitle>

        <DialogContent sx={{
          width:['100%','33rem']
        }}>
          <section className="min-h-[5rem] text-lg">
          <p>Are you sure you want to remove <strong>{displayName}</strong>?</p>
          </section>
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
        }}>
          <Button
            tabIndex={1}
            onClick={onCancel}
            color="secondary"
            sx={{
              marginRight: '1rem',
            }}
          >
            Cancel
          </Button>
          <Button
            tabIndex={0}
            type="button"
            variant="contained"
            color="error"
            endIcon={
              <DeleteIcon />
            }
            onClick={onDelete}
          >
            Remove
          </Button>
        </DialogActions>

    </Dialog>
  )
}
