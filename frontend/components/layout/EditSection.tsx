
export default function EditSection({children,className=''}:{children:any,className?:string}) {
  return (
    <section className={`flex-1 md:pl-[3rem] ${className}`}>
      {children}
    </section>
  )
}
