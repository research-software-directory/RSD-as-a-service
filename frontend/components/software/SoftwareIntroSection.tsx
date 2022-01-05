
import {ContributorMentionCount} from '../../utils/getSoftware'
import SoftwareStatCounter from './SoftwareStatCounter'

export default function SoftwareIntroSection({brand_name, short_statement, counts}:
  { brand_name: string, short_statement: string, counts: ContributorMentionCount }) {

  return (
    <section className="flex flex-col lg:flex-row px-4 py-6 lg:py-12">
      <div className="flex-1 lg:pr-12">
        <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-tight">{brand_name}</h1>
        <p className="pt-6 pb-4 text-[1.5rem] lg:text-[2rem]">
          {short_statement}
        </p>
      </div>
      <div className="flex justify-around lg:justify-end">
        <SoftwareStatCounter
          label='mentions'
          value={counts?.mention_cnt}
        />
        <SoftwareStatCounter
          label='contributors'
          value={counts?.contributor_cnt}
        />
      </div>
    </section>
  )
}
