// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

type CardTitleProps = {
  title: string,
  children: any,
  className?: string
}

/**
 * Card title max 3 lines with line clamp
 * @returns 
 */
export default function CardTitle({title,children,className=''}:CardTitleProps) {
  return (
    <h2
      title={title}
      className={`group-hover:text-white line-clamp-3 max-h-[6.5rem] ${className}`}
    >
      {children}
    </h2>
  )
}