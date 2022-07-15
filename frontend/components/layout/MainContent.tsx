
type MaintContainerProps = {
  className?: string
  props?: any
  children:any
}

export default function MainContent({className,children,...props}:MaintContainerProps) {
  return (
    <main
      className={`flex-1 flex flex-col px-4 lg:container lg:mx-auto ${className ?? ''}`}
      {...props}
    >
      {children}
    </main>
  )
}
