
import SoftwareStatCounter from './SoftwareStatCounter'

export default function SoftwareIntroSection({brand_name,short_statement}:{brand_name:string,short_statement:string}) {
  return (
    <section className="flex flex-col lg:flex-row px-4 py-6 lg:py-12">
      <div className="flex-1 pr-6">
        <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-tight">{brand_name}</h1>
        <p className="pt-6 pb-4 text-[1.5rem] lg:text-[2rem]">
          {short_statement}
        </p>
      </div>
      <div className="flex justify-around lg:justify-end">
        <SoftwareStatCounter
          label='mentions'
          value={125}
        />
        <SoftwareStatCounter
          label='contributors'
          value={15}
        />
      </div>
    </section>
  )
}
