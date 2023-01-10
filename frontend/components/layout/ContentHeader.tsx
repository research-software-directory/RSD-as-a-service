// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {GoBackLink} from '~/components/GoBackLink'
import useRsdSettings from '~/config/useRsdSettings'

type ContentHeaderProps = {
  title: string,
  subtitle: string | null,
  children?: any
}

export default function ContentHeader({title,subtitle,children}: ContentHeaderProps) {
  const {embedMode} = useRsdSettings()

  return (
    <section className="flex-1 flex flex-col px-4 py-6 lg:container lg:mx-auto lg:flex-row lg:py-12">
      <div className="flex-1 lg:pr-12">
        {/*go back link*/}
        {embedMode && <GoBackLink />}
        <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-tight">
          {title}
        </h1>
        <p className="pt-6 pb-4 text-[1.5rem] lg:text-[2rem]">
          {subtitle}
        </p>
      </div>
      <div className="flex justify-around lg:justify-end">
        {children}
      </div>
    </section>
  )
}
