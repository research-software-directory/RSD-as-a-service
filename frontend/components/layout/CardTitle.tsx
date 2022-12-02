// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleProps = {
  title: string,
  children: any,
  className?: string
}

/**
 * Card title max 2 lines with line clamp
 * @returns
 */
export default function CardTitle({title,children,className=''}:CardTitleProps) {
  return (
    <h2
      data-testid="card-title"
      title={title}
      className={`group-hover:text-white line-clamp-2 h-[4rem] ${className}`}
    >
      {children}
    </h2>
  )
}
