import styled from '@mui/system/styled'

const Table = styled('table')(({theme})=>({
  width:'100%',
  fontSize: '0.75rem',
  textAlign: 'right',
}))

export default function LastUpdate({updatedAt}:{updatedAt:string}) {
  function getLocaleDateString(){
    try{
      return new Date(updatedAt).toLocaleDateString('nl-NL')
    }catch(e){
      return "Unknown"
    }
  }

  return (
    <Table>
      <tbody>
        <tr><td>Last update</td></tr>
        <tr><td>{getLocaleDateString()}</td></tr>
      </tbody>
    </Table>
  )
}