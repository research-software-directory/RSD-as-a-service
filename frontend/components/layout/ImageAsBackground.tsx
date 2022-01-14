import styled from '@mui/system/styled'
import {ReactNode} from 'react'
import {Url} from 'url'

export default function ImageAsBackground({src, alt, className}:
  { src: string, alt: string, className:string }) {
  // debugger
  let imageUrl = src
  if (!imageUrl) {
    imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
  }

  return (
    <div
      role="img"
      style={{
        flex: 1,
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor:'#eee'
      }}
      aria-label={alt}
      className={className}
    ></div>
  )
}
