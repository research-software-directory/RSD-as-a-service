// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {deleteImage} from '~/utils/editImage'
import IconBtnMenuOnAction, {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {NewsAction} from '~/components/news/overview/useOnNewsAction'
import {deleteNewsImages, deleteNewsItem, NewsImageProps, NewsListItemProps} from '~/components/news/apiNews'

function getMenuOptions(item:NewsListItemProps){
  const menuOptions:IconBtnMenuOption<NewsAction>[]=[{
    type:'action',
    key: 'edit',
    label: 'Edit article',
    icon: <EditIcon />,
    action:{
      type: 'EDIT',
      payload: `/news/${item.publication_date}/${item.slug}/edit`
    }
  },{
    type:'action',
    key: 'delete',
    label: 'Delete article',
    icon: <DeleteIcon />,
    action:{
      type: 'DELETE',
      payload: `/news/${item.publication_date}/${item.slug}`
    }
  }]
  return menuOptions
}

async function deleteArticle(id:string,image_for_news:NewsImageProps[],token:string):Promise<{status:number,message:string}>{
  try{
    // delete images from image_for_news FIRST (reference index)
    await deleteNewsImages({
      news_id: id,
      token
    })
    // delete article
    const resp = await deleteNewsItem({
      id,
      token
    })
    // if status OK
    if (resp.status===200){
      // delete all images if any defined
      if (image_for_news?.length>0) {
        const delImages = image_for_news.map(img=>deleteImage({
          id:img.image_id,
          token
        }))
        // do not wait for response
        await Promise.all(delImages)
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

export default function NewsItemMenu({item}:Readonly<{item:NewsListItemProps}>) {
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [delModal, setDelModal] = useState({open:false,title:''})

  function onMenuAction(action:NewsAction){
    // console.log('onMenuIcon...', action)
    switch(action.type){
      case 'DELETE':
        setDelModal({
          open: true,
          title: item.title
        })
        break
      case 'EDIT':
        // open edit page
        router.push(action.payload)
        break
      default:
        logger(`NewsItemMenu: ${action.type}...NOT SUPPORTED!`)
    }
  }

  return (
    <>
      <div className="bg-base-100 rounded-[50%] mr-2 absolute top-2 right-1">
        <IconBtnMenuOnAction
          options={getMenuOptions(item)}
          onAction={onMenuAction}
        />
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
          deleteArticle(item.id,item.image_for_news,token).then(({status,message})=>{
            // move to news root page after delete
            if (status===200){
              router.replace('/news')
            }else{
              showErrorMessage(`Failed to remove article. ${message ?? ''}`)
            }
          })
        }}
      />
    </>
  )

}
