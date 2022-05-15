
export default function EditSectionTitle({title, subtitle = '', children, count}:
  { title: string, subtitle?: string, children?: any, count?:number }) {

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
          <h2 className="flex-1">{title}</h2>
          {children}
        </div>
        {getSubtitle()}
      </>
    )
  }

  return (
    <>
      <h2>{title}</h2>
      {getSubtitle()}
    </>
  )

}
