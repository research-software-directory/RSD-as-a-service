import Link from 'next/link'
import StarIcon from '@mui/icons-material/Star'

export default function SoftwareCard({href,brand_name,short_statement,is_featured,updated_at}:
  {href:string,brand_name:string,short_statement:string,is_featured:boolean,updated_at:string}) {

  const colors = is_featured ? "bg-primary text-white" : "bg-gray-200 text-gray-800"

  function getInitals(){
    return brand_name.slice(0,2).toUpperCase()
  }

  function renderFeatured(){
    if (is_featured){
      return (
        <div className="flex items-start justify-center">
          <StarIcon sx={{height:'1rem'}} />
          Featured
        </div>
      )
    }
  }

  return (
    <Link href={href} passHref>
      <a className={`flex flex-col min-h-[15rem] ${colors} hover:bg-secondary hover:text-white`}>
        <div className="flex min-h-[6rem]">
          <h2 className="p-4 flex-1">{brand_name}</h2>
          <div className="flex w-[4rem] h-[4rem] justify-center items-center bg-white text-gray-800 text-[1.5rem]">
            {getInitals()}
          </div>
        </div>
        <p className="flex-1 p-4">
          {short_statement}
        </p>
        <div className="flex justify-between p-4 text-sm">
          <span className="last-update">5 days ago</span>
          {renderFeatured()}
        </div>
      </a>
    </Link>
  )
}