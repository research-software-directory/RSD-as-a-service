
export default function StickyHeader({children, className}:
  { children: any, className?: string}) {
  return (
    <section
      className={`sticky top-0 z-10 ${className}`}
    >
      {children}
    </section>
  )
}
