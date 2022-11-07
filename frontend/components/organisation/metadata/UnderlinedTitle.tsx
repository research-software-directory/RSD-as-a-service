export default function UnderlinedTitle({title}:{title: string}) {
  return (
    <>
      <h4 className="pt-2 text-base-content-disabled">{title}</h4>
      <hr className="pb-2" />
    </>
  )
}
