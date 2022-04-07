
export default function TagListItem({label, className}:
  {label: string, className?:string}) {
  if (!label) return null
  return (
    <li className={`m-[0.125rem] px-4 py-2 ${className ? className : 'bg-grey-200' }`}>{label}</li>
  )
}
