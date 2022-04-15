

type ContentHeaderProps = {
  title: string,
  subtitle: string | null,
  children?: any
}

export default function ContentHeader({title,subtitle,children}:ContentHeaderProps) {
  return (
    <section className="flex flex-col lg:flex-row px-4 py-6 lg:py-12">
      <div className="flex-1 lg:pr-12">
        <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-tight">{title}</h1>
        <p className="pt-6 pb-4 text-[1.5rem] lg:text-[2rem]">
          {subtitle}
        </p>
      </div>
      <div className="flex justify-around lg:justify-end">
        {children}
      </div>
    </section>
  )
}
