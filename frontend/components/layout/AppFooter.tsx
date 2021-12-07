import Link from 'next/link'
import LogoEscience from './LogoEscience'
import Mail from '@mui/icons-material/Mail'

export default function AppFooter () {
  return (
    <footer className="flex flex-wrap bg-secondary text-white">
      <div className="flex flex-wrap container mx-auto py-10 px-4">
        <div className="w-full sm:w-1/2 px-10 sm:px-16">
          <div className="text-xl mb-4">
            The Research Software Directory aims to promote the impact,
            the exchange and re-use of research software.
            Please use our tools! <Link href="/about">Read more</Link>
          </div>
          <a target="_blank" href="https://esciencecenter.nl" rel="noreferrer"
             className="hover:text-primary"
          >
            <LogoEscience />
          </a>
          <div className="text-sm mt-4">Copyright © {new Date().getFullYear()}</div>
        </div>
        <div className="w-full sm:w-1/2 px-10 sm:px-16">
          <div className="text-xl">Questions or comments?</div>

          <a href="mailto:rsd@esciencecenter.nl"
             className="mt-2 text-primary hover:text-white flex"
          >
            <Mail className="mr-2"/> rsd@esciencecenter.nl
          </a>

          <div className="mt-8 text-xl">Netherlands eScience Center</div>
          <div className="flex flex-col">
            <Link href="/" passHref>
              <a className="text-xl primary-link">Home</a>
            </Link>
            <Link href="/projects" passHref>
              <a className="text-xl primary-link">Projects</a>
            </Link>
            <Link href="/#" passHref>
              <a className="text-xl primary-link">People</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
