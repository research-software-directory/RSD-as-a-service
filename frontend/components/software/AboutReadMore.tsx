import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function AboutReadMore({readMoreItems=[]}:{ readMoreItems: string[] }) {

  if (readMoreItems.length===0) return null

  return (
    <Accordion
      data-testid='about-read-more-section'
      sx={{
        boxShadow: 0,
        border: '1px solid',
        borderColor: 'divider'
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor:'background.default'
        }}
      >
        <Typography>Read more</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{
        // set max height to avoid large shifts
        maxHeight: '30rem',
        //avoid resizing when scrollbar appears
        overflow: 'overlay'
      }}>
        {readMoreItems.map((item, pos) => {
          return <p key={pos} className="mb-4 break-word lg:text-justify">{item}</p>
        })}
      </AccordionDetails>
    </Accordion>
  )
}
