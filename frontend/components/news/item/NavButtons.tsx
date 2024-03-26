// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import {useSession} from '~/auth'
import {deleteImage} from '~/utils/editImage'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import {deleteNewsItem} from '../apiNews'
import useSnackbar from '~/components/snackbar/useSnackbar'

type NavButtonsProps={
  id:string
  title:string
  slug:string
  image_id: string|null
  isMaintainer: boolean
  token: string
}

async function deleteArticle(id:string,image_id:string|null,token:string):Promise<{status:number,message:string}>{
  try{
    // delete article
    const resp = await deleteNewsItem({
      id,
      token
    })
    if (resp.status===200){
      // delete image if exists
      // do not wait for response
      if (image_id) {
        await deleteImage({
          id:image_id,
          token
        })
      }
    }
    return resp
  }catch(e:any){
    return {
      status:500,
      message: e?.message
    }
  }
}

export function NavButtons({id,slug,title,image_id,isMaintainer}:NavButtonsProps){
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [delModal, setDelModal] = useState({open:false,title:''})
  const url = `/news/${slug}/edit`

  if (isMaintainer===false) return null

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Button
          data-testid="delete-button"
          title="Delete"
          variant="text"
          color='error'
          startIcon={<DeleteIcon />}
          sx={{
            textTransform:'capitalize'
          }}
          onClick={() => {
            setDelModal({
              open: true,
              title: title
            })
          }}
        >
          {/* Delete page */}
        Delete article
        </Button>
        <Button
          data-testid="edit-button"
          title='Edit article'
          variant='contained'
          startIcon={<EditIcon />}
          sx={{
            textTransform:'capitalize'
          }}
          onClick={() => {
            router.push(url)
          }}
        >
          {/* Edit page */}
          Edit article
        </Button>
      </div>
      <ConfirmDeleteModal
        title="Delete article"
        open={delModal.open}
        body={
          <p>Are you sure you want to remove <strong>{delModal.title ?? ''}</strong>?</p>
        }
        onCancel={()=>{
          setDelModal({
            open: false,
            title: ''
          })
        }}
        onDelete={()=>{
          // delete article
          deleteArticle(id,image_id,token).then(({status,message})=>{
            // move to news root page after delete
            if (status===200){
              router.push('/news')
            }else{
              showErrorMessage(`Failed to remove article. ${message ?? ''}`)
            }
          })
        }}
      />
    </>
  )
}
