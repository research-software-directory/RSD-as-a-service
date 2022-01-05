
export default function SoftwareStatCounter({label,value}:{label:string,value:number|null}) {

  if (value && label){
    return (
      <div className="px-4 text-center">
        <div className="text-primary text-[3.5rem]">{value}</div>
        <div className="text-secondary">{label}</div>
      </div>
    )
  }
  // return nothing if values not provided
  return null
}
