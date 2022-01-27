
export default function EditSoftwareSection({children,className=''}:{children:any,className?:string}) {
  return (
    <section className={`flex-1 md:pl-8 ${className}`}>
      {children}
    </section>
  )
}
