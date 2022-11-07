import Link from 'next/link'
import UnderlinedTitle from './UnderlinedTitle'

export type LinksProps = {
  title: string,
  url: string
  icon: JSX.Element,
}

export default function Links({links=[]}:{links:LinksProps[]}) {
  try {
    if (links.length === 0) return null

    return (
      <>
        <UnderlinedTitle title='Links' />
        <ul>
        {links.map(item => {
          return (
            <li
              key={item.url}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: '0.5rem 0rem'
              }}
            >
            <Link
              key={item.url}
              href={item.url}
              passHref
            >
              <a target="_blank">
                {item.icon} {item.title}
              </a>
            </Link>
            </li>
          )
        })}
        </ul>
      </>
    )
  } catch (e) {
    return null
  }
}
