// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {TopNewsProps} from '~/components/news/apiNews'
import GradientBorderButton from './GradientBorderButton'
import {home_config} from './home_config'
import HomepageDivider from './HomepageDivider'

const {button} = home_config

function TopNewsItem({item}:{item:TopNewsProps}){
  return (
    <Link
      href={`/news/${item.publication_date}/${item.slug}`}
    >
      <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="0">
        {/* <LandingPageImpactIcon className="h-auto mr-5 pt-1 scale-125 shrink-0" /> */}
        <div>
          <h3 className="mb-4 text-2xl font-medium">{item.title}</h3>
          <p className="text-lg opacity-70">{item.summary}</p>
        </div>

      </article>
    </Link>
  )
}
/**
 * Top news items including the homepage divider.
 * If there are no news items it returns null.
 * */
export default function TopNewsSection({news}:{news:TopNewsProps[]}) {

  // console.group('TopNewsSection')
  // console.log('news...',news)
  // console.groupEnd()

  if (news?.length > 0){
    return (
      <>
        <HomepageDivider />
        <section
          id="top-news"
          className="p-5 md:p-10 w-full max-w-(--breakpoint-xl) mx-auto">

          <h2 className="flex justify-start text-3xl lg:text-4xl font-rsd-titles font-bold mt-6"
            data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
            Latest news
          </h2>

          <div className="grid gap-20 grid-cols-1 md:grid-cols-2 pt-14">
            {news.map(item=>{
              return <TopNewsItem key={item.id} item={item} />
            })}
            <div className="flex justify-center items-center"
              data-aos="fade"
              data-aos-easing="ease-in-out"
              data-aos-duration="500"
            >
              <GradientBorderButton
                text={button.news.label}
                url={button.news.url}
                target={button.news.target}
              />
            </div>
          </div>
        </section>
      </>
    )
  }
  return null
}
