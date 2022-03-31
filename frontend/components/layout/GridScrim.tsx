import FlexibleGridSection from './FlexibleGridSection'

type GridScrimProps={
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string
  height: string
  rows: number,
  className: string
}

export default function GridScrim({rows,height,className,...props}:GridScrimProps){
  function renderRows(){
    const html=[]
    for (let i=0;i<rows;i++){
      html.push(
        <article
          key={i}
          className="bg-grey-100 w-full"
          style={{'height': height}}
        >
          </article>
      )
    }
    return html
  }
  return (
    <FlexibleGridSection
      className={className}
      {...props}
    >
      {renderRows()}
    </FlexibleGridSection>
  )
}
