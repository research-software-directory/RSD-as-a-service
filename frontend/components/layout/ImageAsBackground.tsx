/* eslint-disable @next/next/no-img-element */
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

export default function ImageAsBackground({src, alt, className, bgSize='cover', noImgMsg='no image avaliable'}:
  {src: string | null | undefined, alt: string, className: string, bgSize?:string, noImgMsg?:string }) {

  if (!src) {
    return (
      <div
        className={`${className} flex flex-col justify-center items-center text-grey-500 rounded-sm`}
      >
        <PhotoSizeSelectActualOutlinedIcon
          sx={{
            width: '4rem',
            height: '4rem'
          }}
        />
        <div className="uppercase text-center">{noImgMsg}</div>
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
      className={`${className} rounded-sm`}
    ></div>
  )
}
