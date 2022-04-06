import {useState} from 'react'
import AppFooter from '~/components/layout/AppFooter'
import ThemeSwitcher from '~/components/layout/ThemeSwitcher'
import LogoRSD from '~/components/svg/LogoRSD'
import SimpleCircle from '~/components/svg/SimpleCircle'
import Link from 'next/link'
import LoginButton from '~/components/login/LoginButton'
import styles from '~/components/home/home.module.css'
import LogoEscience from '~/components/home/logos/LogoEscience'
import LogoSurf from '~/components/home/logos/LogoSurf'

const whyrsd = [
  'Improves findability of software packages.',
  'Includes metadata to help search engines understand what a given software package is about.',
  'Harvests data from Zotero, Zenodo, GitHub, GitLab, and other sources.',
  'Presents software packages within their social and scientific context.',
  'Promotes dissemination of software.',
  // 'Modular system that is meant to be customizable, e.g. with respect to branding, database schemas, an so on..',
  'Makes scientific impact visible in a qualitative way.',
  'Helps decision-making based on metrics and graphs.',
  'Provides metadata via OAI-PMH, the standard protocol for metadata harvesting.',
  'The Research Software Directory is a content management system that is tailored to software.'
]


export default function Home() {
  const [isDark, setDark] = useState(true)

  return (
    <div className={` ${isDark && 'dark'} `}>
      <div className="bg-white dark:bg-black dark:text-white">

        {/* Page  */}
        <header className="sticky top-0 z-10  backdrop-filter backdrop-blur-xl bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-60" >
          <div className="container mx-auto flex p-6 items-center">
            <Link href="/" passHref>
              <a><LogoRSD className="text-black dark:text-white "></LogoRSD></a>
            </Link>
            <div className="hidden sm:flex ml-10 flex-1 text-xl gap-3 text-center">
              <a href="#whyrsd">Why RSD</a>
              <Link href="/organisation">Organizations</Link>
              <Link href="/about">About us</Link>
            </div>


            {/* Search  */}
            {/*<div className="border px-3 py-2 flex relative ml-auto rounded-sm">*/}
            {/*  <svg className="absolute right-[10px] top-[10px]" width="22" viewBox="0 0 18 18"*/}
            {/*       fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*    <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>*/}
            {/*  </svg>*/}
            {/*  <input type="search" name="q" className=" bg-transparent focus:outline-none"*/}
            {/*         placeholder="Search Software" autoComplete="off"/>*/}
            {/*</div>*/}

            <ThemeSwitcher onClick={() => setDark(!isDark)}/>

            <LoginButton/>
          </div>

        </header>

        {/* Jumbo Banner  */}
        <div className="container mx-auto mt-20 flex relative">
          <div className="w-1/3 flex flex-col justify-center">
            <div className="text-5xl font-rsd-titles font-bold">Encouraging the <br/>re-use of
              research
              software
            </div>
            <div className="mt-8 text-lg">To promote the visibility, impact and reuse of research
              software, <span
                className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-green-400">the Netherlands eScience Center </span> has
              developed the Research Software Directory, a content management system tailored to
              software.
            </div>

            {/* Email  */}
            {/* <div className="mt-10 flex gap-4">
              <input type="email"
                     className="border p-3 text-xl flex-1 text-white bg-transparent rounded-sm focus:outline-none"
                     placeholder="Email address"/>


              <button type="submit" className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
                <div
                  className="relative px-3 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none flex items-center space-x-2">
                    <span className="space-y-2 text-black text-xl whitespace-nowrap">
                    Sign up for the RSD
                    </span>
                </div>

              </button>

            </div>*/}

            <div className="mt-10 flex gap-4">
              <button type="submit" className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
                <a
                  href="mailto:rsd@esciencecenter.nl?subject=More information about the RSD&body=Hi, I would like to get in contact to start my organization within the Research Software Directory"
                  className="flex gap-3 text-black relative px-3 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none flex items-center space-x-2 ">
                    <span className="space-y-2 text-xl whitespace-nowrap ">
                      Sign up for the RSD
                    </span>
                  {/*<svg width="30" viewBox="0 0 50 36" fill="none"*/}
                  {/*     xmlns="http://www.w3.org/2000/svg">*/}
                  {/*    <path*/}
                  {/*      d="M0 0V36H50V0H0ZM2 2H48V34H2V2ZM4 6.91797V9.27734L25 21.1797L46 9.27734V6.91797L25 18.8203L4 6.91797Z"*/}
                  {/*      fill="currentColor"/>*/}
                  {/*  </svg>*/}
                </a>
              </button>
            </div>


          </div>
          <div className="absolute -top-20 right-0">

            <svg height="700" viewBox="0 0 651 727" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_17_106)">
                <circle cx="283.816" cy="251.979" r="83" fill="#FE53BB"/>
              </g>
              <g filter="url(#filter1_f_17_106)">
                <circle cx="545.816" cy="426.979" r="100" fill="#09FBD3"/>
              </g>
              <g filter="url(#filter2_b_17_106)">
                <circle cx="388.926" cy="357.479" r="169" fill="white" fillOpacity="0.15"
                />
                <circle cx="388.926" cy="357.479" r="167" stroke="url(#paint0_linear_17_106)"
                        strokeWidth="4"/>
              </g>
              <mask id="mask0_17_106" maskUnits="userSpaceOnUse" x="224"
                    y="193" width="329" height="329">
                <circle cx="388.926" cy="357.479" r="164" fill="#C4C4C4"/>
              </mask>
              <g mask="url(#mask0_17_106)">
              </g>
              <defs>
                <filter id="filter0_f_17_106" x="0.816162" y="-31.021" width="566" height="566"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                           result="shape"/>
                  <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_17_106"/>
                </filter>
                <filter id="filter1_f_17_106" x="245.816" y="126.979" width="600" height="600"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                           result="shape"/>
                  <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_17_106"/>
                </filter>
                <filter id="filter2_b_17_106" x="179.926" y="148.479" width="418" height="418"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feGaussianBlur in="BackgroundImage" stdDeviation="20"/>
                  <feComposite in2="SourceAlpha" operator="in"
                               result="effect1_backgroundBlur_17_106"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_17_106"
                           result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_17_106" x1="301.926" y1="213.479" x2="519.926"
                                y2="475.479" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FE53BB"/>
                  <stop offset="0.431255" stopColor="#9E95C4" stopOpacity="0"/>
                  <stop offset="0.639367" stopColor="#6AB9CA" stopOpacity="0"/>
                  <stop offset="1" stopColor="#09FBD3"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/*  Divider  */}
        <div className="container mx-auto border-t border-gray-800 mt-[130px]"></div>
        {/* stats  */}
        <div className="container mx-auto flex mt-16">
          <div className="w-1/5">
            <div className="text-lg"> 30+ thousands</div>
            <div className="opacity-40">Researchers</div>
          </div>

          <div className="w-1/5">
            <div className="text-lg">20 Research Centers</div>
            <div className="opacity-40">Organizations</div>
          </div>

          <div className="w-1/5">
            <div className="text-lg"> 500+ Software</div>
            <div className="opacity-40">Packages</div>
          </div>
        </div>

        <div className="bg-[#eee] dark:bg-[#111]">
          {/* separator  */}
          {isDark ?
            <img width="100%" className="-translate-y-1"
                 src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNSIgaGVpZ2h0PSI3NSIgdmlld0JveD0iMCAwIDEwMjUgNzUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2lfNTVfMTY5KSI+CjxwYXRoIGQ9Ik0wLjMyNjE3MiAwLjcyOTczNkgxMDI0LjMzVjc0LjAzNThDNjA1LjkwOSA0LjkyMDM2IDM4MS41OTUgNC42MTI0IDAuMzI2MTcyIDc0LjAzNThWMC43Mjk3MzZaIiBmaWxsPSJibGFjayIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2lfNTVfMTY5IiB4PSIwLjMyNjE3MiIgeT0iMC43Mjk3MzYiIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjczLjMwNTkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeT0iLTEiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwLjU2NDcwNiAwIDAgMCAwIDAuNTY0NzA2IDAgMCAwIDAgMC41NjQ3MDYgMCAwIDAgMC4zNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJzaGFwZSIgcmVzdWx0PSJlZmZlY3QxX2lubmVyU2hhZG93XzU1XzE2OSIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K"
            />
            :
            <img width="100%" className="-translate-y-1 scale-100"
                 src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNSIgaGVpZ2h0PSI3NCIgdmlld0JveD0iMCAwIDEwMjUgNzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2lfNTVfMTcwKSI+CjxwYXRoIGQ9Ik0wLjk0MjYyNyAwLjU3MTI4OUgxMDI0Ljk0VjczLjg3NzNDNjA2LjUyNSA0Ljc2MTkyIDM4Mi4yMTIgNC40NTM5NiAwLjk0MjYyNyA3My44NzczVjAuNTcxMjg5WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9pXzU1XzE3MCIgeD0iMC45NDI2MjciIHk9IjAuNTcxMjg5IiB3aWR0aD0iMTAyNCIgaGVpZ2h0PSI3My4zMDYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeT0iLTEiLz4KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwLjU2NDcwNiAwIDAgMCAwIDAuNTY0NzA2IDAgMCAwIDAgMC41NjQ3MDYgMCAwIDAgMC4zNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJzaGFwZSIgcmVzdWx0PSJlZmZlY3QxX2lubmVyU2hhZG93XzU1XzE3MCIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4K"
            />
          }

          {/* Logos  */}
          <div className="container mx-auto">
            <div className="flex gap-10 container flex-wrap mt-6 items-center opacity-30">
              <LogoEscience className="max-w-[200px] max-h-[100px]"/>
              <LogoSurf className="max-w-[200px] max-h-[100px]"/>
            </div>
          </div>

          {/* cards  */}

          <div className="container mx-auto flex gap-3 mt-16">
            <div className="w-1/3">
              <div className={`${styles.card} h-full`}>
                <div className={styles.cardInside}
                     style={{backgroundImage: 'url("/images/find_bg.webp")'}}>
                  <div className="flex flex-col justify-center text-white">
                    <div className="text-3xl font-medium">
                      Find quality Software
                    </div>
                    <div className="text-lg mt-5">
                      Find and judge the relevance and quality of <span className="text-blue-400"> research software </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/3">
              <div className={`${styles.card} h-full`}>
                <div className={styles.cardInside}
                     style={{backgroundImage: 'url("/images/recognition_bg.webp")'}}>
                  <div className="flex flex-col justify-center text-white" style={{}}
                  >
                    <div className="text-3xl font-medium">
                      Recognize
                    </div>
                    <div className="text-lg mt-5">Encourages research software engineers to make
                      their research software findable and accessible, ensuring
                      recognition of their work
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className={`${styles.card} h-full`}>
                <div className={styles.cardInside}
                     style={{backgroundImage: 'url("/images/impact_bg.webp")'}}>
                  <div className="flex flex-col justify-center text-white">
                    <div className="text-3xl  font-medium">
                      Impact
                    </div>
                    <div className="text-lg mt-5">Facilitates research institutes to showcase the
                      software produced by their organization and
                      monitor its reuse and impact
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* software into context  */}

          <div className={`${styles.card} container mx-auto mt-5`}>
            <div className={styles.cardInside}
                 style={{backgroundImage: 'url("/images/context_bg.webp")'}}>
              <div className="flex flex-col justify-center text-white">
                <div className="text-3xl  font-medium">
                  Software in context
                </div>
                <div className="text-lg mt-5">All software on the research Software Directory is
                  presented within its research context. Every page
                  contains links to research papers, projects, and presentations for example. The
                  pages also show a social context- who are the
                  developers, how active is the development, are there ay tutorials, blog posts,
                  or videos?
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-20">
            <div id="whyrsd" className="text-3xl font-rsd-titles font-bold">Why the RSD?</div>
            <ul className="mt-10 ">
              {whyrsd.map((text, i) =>
                <li className="flex gap-3 items-center mt-3 text-lg" key={i}>
                  <SimpleCircle/> {text}
                </li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-20">
            <AppFooter/>
          </div>
        </div>
      </div>
    </div>
  )
}
