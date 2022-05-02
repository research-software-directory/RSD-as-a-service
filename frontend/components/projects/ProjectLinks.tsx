import Link from 'next/link'
import {ProjectLink} from '../../types/Project'

export default function ProjectLinks({links}: { links: ProjectLink[] }) {
  if (!links || links?.length === 0) {
    return (
      <div>
        <h4 className="text-primary py-4">Project links</h4>
        <i>Not specified</i>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-primary py-4">Project links</h4>
      <ul>
      {
        links.map(link => {
          if (link.url) {
            return (
              <Link
                key={link.url}
                href={link.url}
                passHref
              >
                <a target="_blank">
                  <li className="text-sm py-1">
                    {link.title}
                  </li>
                </a>
              </Link>
            )
          }
        })
      }
      </ul>
    </div>
  )
}
