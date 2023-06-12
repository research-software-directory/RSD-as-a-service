// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type MaintContainerProps = {
  className?: string
  props?: any
  children:any
}

export default function MainContent({className, children, ...props}: MaintContainerProps) {
  // keep these styles in sync with AppHeader and AppFooter
  return (
    <main
      className={`flex-1 flex flex-col px-4 lg:container lg:mx-auto ${className ?? ''}`}
      {...props}
    >
      {children}
    </main>
  )
}
