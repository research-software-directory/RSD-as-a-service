
export default function EditSectionTitle({title, subtitle = '', children}:
  { title: string, subtitle?: string, children?: any }) {

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
