
export default function EditSectionTitle(
  {title, subtitle = '', children, hlevel = 2}:
  { title: string, subtitle?: string, children?: any, hlevel?: number }
) {

  const HeadingTag: any = `h${hlevel}`

  function getSubtitle() {
    if (subtitle) {
      return (
        <p className="mb-4"
          dangerouslySetInnerHTML={{__html: subtitle}}>
        </p>
      )
    }
  }

  if (children) {
    return (
      <>
        <div className="flex">
          <HeadingTag className="flex-1">{title}</HeadingTag>
          {children}
        </div>
        {getSubtitle()}
      </>
    )
  }

  return (
    <>
      <HeadingTag>{title}</HeadingTag>
      {getSubtitle()}
    </>
  )

}
