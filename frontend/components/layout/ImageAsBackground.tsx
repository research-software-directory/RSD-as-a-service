/* eslint-disable @next/next/no-img-element */
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

export default function ImageAsBackground({src, alt, className}:
  { src: string, alt: string, className:string }) {
  let imageUrl = src
  if (!imageUrl) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-grey-500 bg-grey-200">
        <PhotoSizeSelectActualOutlinedIcon sx={{width: '5rem', height:'5rem'}} />
        <div className="uppercase">no image avaliable</div>
      </div>
    )
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
      }}
      aria-label={alt}
      className={className}
    ></div>
  )
}
