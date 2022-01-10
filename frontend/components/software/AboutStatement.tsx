
import AboutReadMore from './AboutReadMore'

export default function AboutStatement({brand_name = '', bullets = '', read_more = ''}:
  { brand_name: string, bullets: string, read_more: string }) {

  // skip section if no brand_name
  if (brand_name==='' || bullets==='') return null

  // bullets are provided with '*' or '-' so we split on it
  let bulletItems:string[] = []
  if (bullets.indexOf('*') > -1) {
    bulletItems = bullets.split('*')
  } else if (bullets.indexOf('-') > -1) {
    bulletItems = bullets.split('-')
  }

  // read_more has (\n\n) to indicate a new paragraph
  let readMoreItems:string[]=[]
  if (read_more) readMoreItems = read_more.split('\n\n')

  return (
    <>
      <h2
        className="text-[2rem] text-primary pb-4"
        data-testid="about-statement-title"
      >
        What {brand_name} can do for you
      </h2>
      <ul className="list-disc pl-7 break-words">
        {bulletItems.map((item, pos) => {
          // first item is always empty
          if (pos === 0) return null
          return (
            <li key={pos}
              className="pb-4 pl-4 break-word lg:text-justify"
              data-testid="about-bullet-item"
            >{item}</li>
          )
        })}
      </ul>
      <div className="mt-4">
        <AboutReadMore readMoreItems={readMoreItems} />
      </div>
    </>
  )
}
