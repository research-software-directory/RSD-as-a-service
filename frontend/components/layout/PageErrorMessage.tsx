import ContentInTheMiddle from './ContentInTheMiddle'

export default function ContentErrorMessage({statusCode = 500, message = 'Failed to process you request'}: {
  statusCode:number, message:string
}) {
  return (
    <ContentInTheMiddle>
      <section className="flex justify-center items-center text-secondary">
        <h1 className="border-r-2 px-4 font-medium">{statusCode}</h1>
        <p className="px-4 tracking-wider">{message}</p>
      </section>
    </ContentInTheMiddle>
  )
}
