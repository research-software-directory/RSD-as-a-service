export default function HelperTextWithCounter({message,count}:{message:string|undefined,count:string}) {
  return (
    <>
      <span className="mr-2">{message}</span>
      <span>{count}</span>
    </>
  )
}
