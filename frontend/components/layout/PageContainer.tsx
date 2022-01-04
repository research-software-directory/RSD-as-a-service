import {ReactNode} from 'react'

export default function PageContainer({children,className}:{children:ReactNode,className?:string}) {
  return (
    <section
      className={`lg:container lg:mx-auto ${className ? className : ''}`}
    >
      {children}
    </section>
  )
}
