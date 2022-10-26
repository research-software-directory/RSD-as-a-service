// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type MaintContainerProps = {
  className?: string
  props?: any
  children:any
}

export default function MainContent({className,children,...props}:MaintContainerProps) {
  return (
    <main
      className={`flex-1 flex flex-col px-4 w-full max-w-screen-2xl mx-auto ${className ?? ''}`}
      {...props}
    >
      {children}
    </main>
  )
}
