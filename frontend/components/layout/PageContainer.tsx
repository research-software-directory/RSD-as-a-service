import {ReactNode} from 'react'

export default function PageContainer({children,className}:{children:ReactNode,className?:string}) {
  return (
    <section
      className={`flex-1 lg:container lg:mx-auto ${className ? className : ''}`}
    >
      {children}
    </section>
  )
}
