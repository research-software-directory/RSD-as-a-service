/* eslint-disable @next/next/no-img-element */
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

export default function ImageAsBackground({src, alt, className, bgSize='cover', noImgMsg='no image avaliable'}:
  {src: string | null | undefined, alt: string, className: string, bgSize?:string, noImgMsg?:string }) {

  if (!src) {
    return (
      <div className="flex-1 h-full flex flex-col justify-center items-center text-grey-500 bg-grey-50 rounded-md">
        <PhotoSizeSelectActualOutlinedIcon
          sx={{
            width: '4rem',
            height: '4rem'
          }}
        />
        <div className="uppercase">{noImgMsg}</div>
      </div>
    )
  }
  return (
    <div
      role="img"
      style={{
        flex: 1,
        backgroundImage: `url('${src}')`,
        backgroundSize: bgSize,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label={alt}
      className={className}
    ></div>
  )
}
