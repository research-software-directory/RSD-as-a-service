// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {handleFileUpload} from '~/utils/handleFileUpload'
import {deleteImage,getImageUrl,upsertImage} from '~/utils/editImage'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import useSnackbar from '~/components/snackbar/useSnackbar'
import CopyToClipboard from '~/components/layout/CopyToClipboard'
import {NewsImageProps,NewsItem,addNewsImage,deleteNewsImage} from '../apiNews'
import {newsConfig as config} from './config'
import ImageInput from '~/components/form/ImageInput'
import ImageDropZone from '~/components/form/ImageDropZone'

type UploadedImageProps={
  imgUrl: string|null,
  onDelete: ()=>void
}

function UploadedImage({imgUrl,onDelete}:UploadedImageProps){
  const {showErrorMessage, showInfoMessage} = useSnackbar()
  // ignore if no imgUrl
  if (imgUrl===null) return null

  function onCopiedLink(success:boolean){
    if (success){
      showInfoMessage('Copied to clipboard')
    }else{
      showErrorMessage('Failed to copy image link')
    }
  }

  return (
    <div className="relative pb-4" onDragOver={e => e.preventDefault()} onDrop={e => e.preventDefault()}>
      <ImageWithPlaceholder
        placeholder="Uploaded image < 2MB"
        src={imgUrl}
        alt={'image'}
        bgSize={'scale-down'}
        bgPosition={'left top'}
        className="w-full"
      />
      <div className="absolute top-[0.5rem] flex gap-4 justify-between bg-base-100 opacity-70 hover:opacity-100">
        <Button
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          aria-label="Delete image"
        >
          Delete
        </Button>
        <CopyToClipboard
          label="Copy link"
          value={`![image](${imgUrl})`}
          onCopied={onCopiedLink}
        />
      </div>
    </div>
  )
}

export default function AutosaveNewsImage() {
  const {token} = useSession()
  const {showWarningMessage, showErrorMessage, showInfoMessage} = useSnackbar()
  const {watch, setValue} = useFormContext<NewsItem>()

  const [
    form_id, image_for_news, description
  ] = watch([
    'id', 'image_for_news','description'
  ])


  async function saveImage(image_b64: string, mime_type: string) {
    // split base64 to use only encoded content
    const data = image_b64.split(',')[1]
    // debugger
    // add new image to db
    const resp = await upsertImage({
      data,
      mime_type,
      token
    })
    if (resp.status !== 201) {
      showErrorMessage(`Failed to save image. ${resp.message}`)
      return
    }
    // add new image to news images collection
    const add = await addNewsImage({
      id: form_id,
      image_id: resp.message,
      token,
      position: image_for_news?.length===0 ? 'card':'other'
    })

    if (add.status!==200){
      showErrorMessage(`Failed to save image. ${add.message}`)
      return
    }
    // update form values
    setValue('image_for_news',[
      ...image_for_news,
      add.message
    ])
  }

  async function onFileUpload(e: ChangeEvent<HTMLInputElement> | {target: {files: FileList | Blob[]}} | undefined): Promise<void> {
    if (e === undefined) {
      return
    }

    const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
    if (status === 200 && image_b64 && image_mime_type) {
      saveImage(image_b64, image_mime_type)
    } else if (status===413) {
      showWarningMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  async function removeImage(image:NewsImageProps) {
    // remove image from news
    const resp = await deleteNewsImage({
      id: image.id,
      token
    })
    if (resp.status === 200 && image.image_id) {
      // try to remove old image
      // but don't wait for results
      deleteImage({
        id: image.image_id,
        token
      })

      // update the form value
      setValue('image_for_news', image_for_news.filter(item=>item.id!==image.id))

      // check if image used in description (markdown)
      const imgLink = `![image](${getImageUrl(image.image_id)})`
      if (description.includes(imgLink)===true){
        // replace the link
        const withoutLink = description.replaceAll(imgLink,'')
        // update description
        setValue('description',withoutLink)
        // notify user about removal of image link from the markdown
        showInfoMessage('Removed image and the image link from the markdown.')
      }

    } else {
      showErrorMessage(`Failed to remove image. ${resp.message}`)
      return
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.image.label}
        subtitle={config.image.help}
      />
      {/* list uploaded images */}
      {
        image_for_news.map(item=>{
          return (
            <UploadedImage
              key={item.id}
              imgUrl={getImageUrl(item.image_id)}
              onDelete={()=>removeImage(item)}
            />
          )
        })
      }

      <ImageDropZone onImageDrop={onFileUpload}>
        <label htmlFor='upload-article-image'
          style={{cursor: 'pointer'}}
          title="Click or drop to upload an image"
        >
          <ImageWithPlaceholder
            placeholder="Click or drop to upload image < 2MB"
            src={null}
            alt={'image'}
            bgSize={'scale-down'}
            bgPosition={'left center'}
            className="w-full h-[9rem]"
          />
        </label>
      </ImageDropZone>

      <ImageInput
        id="upload-article-image"
        onChange={onFileUpload}
      />
    </>
  )
}
