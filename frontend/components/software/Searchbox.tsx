import {useState} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

export default function Searchbox({onSearch}:{onSearch:Function}) {
  const [state,setState]=useState("")
  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder='Use enter when done typing'
      value={state}
      sx={{
        minWidth:[null,null,'16rem','17.5rem','19.5rem']
      }}
      onChange={({target})=>setState(target.value)}
      onKeyPress={(event)=>{
        // pass search value on enter
        if (event.key.toLowerCase()==='enter'){
          onSearch(state)
        }
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon sx={{cursor:"pointer"}} onClick={()=>onSearch(state)} />
        </InputAdornment>
      }
    />
  )
}