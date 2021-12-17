import {useState, useEffect} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import {useDebounce} from '../../utils/useDebouce'

export default function Searchbox({onSearch,delay=400}:{onSearch:Function,delay?:number}) {
  const [state,setState]=useState({
    value:"",
    wait:true
  })
  const searchFor=useDebounce(state.value,delay)

  useEffect(()=>{
    const {wait,value} = state
    if (wait===false && value===searchFor){
      debugger
      setState({
        wait:true,
        value
      })
      onSearch(searchFor)
    }
  },[state,searchFor,onSearch])

  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder='Search for software'
      value={state.value}
      sx={{
        minWidth:[null,null,'16rem','17.5rem','19.5rem']
      }}
      onChange={({target})=>{
        setState({
          value:target.value,
          wait:false
        })
      }}
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