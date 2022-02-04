import Link from 'next/link'
import LogoEscience from './LogoEscience'
import Mail from '@mui/icons-material/Mail'

export default function AppFooter () {
  return (
    <footer className="flex flex-wrap bg-secondary text-white">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[_2fr,1fr] lg:container lg:mx-auto">

        <div className="pt-10 sm:pb-10">
          <div className="text-lg mb-4">
            The Research Software Directory aims to promote the impact,
            the exchange and re-use of research software.
            {/* Please use our tools!&nbsp;<Link href="/about" passHref>
              <a className="underline mr-2">Read more</a>
            </Link> */}
          </div>
          <a target="_blank" href="https://esciencecenter.nl" rel="noreferrer"
            className="hover:text-primary"
          >
            <LogoEscience />
          </a>
          {/* <div className="text-sm mt-4">Copyright © {new Date().getFullYear()}</div> */}
        </div>

        <div className="pb-10 sm:pt-10">
          <div className="text-lg">Questions or comments?</div>
          <a href="mailto:rsd@esciencecenter.nl"
            className="mt-2 text-primary hover:text-white flex"
          >
            <Mail className="mr-2"/> rsd@esciencecenter.nl
          </a>

          <div className="mt-8 text-lg">Netherlands eScience Center</div>
          <div className="flex flex-col">
            <Link href="/" passHref>
              <a className="footer-link">Home</a>
            </Link>
            <Link href="/projects" passHref>
              <a className="footer-link">Projects</a>
            </Link>
            <Link href="/#" passHref>
              <a className="footer-link">People</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
