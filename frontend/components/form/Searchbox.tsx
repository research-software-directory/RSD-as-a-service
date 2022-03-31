import {useState, useEffect} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import {useDebounce} from '../../utils/useDebouce'
import ClearIcon from '@mui/icons-material/Clear'

export default function Searchbox({placeholder, onSearch, delay = 400}: { placeholder:string,onSearch:Function,delay?:number}) {
  const [state,setState]=useState({
    value:'',
    wait:true
  })
  const searchFor=useDebounce(state.value,delay)

  useEffect(()=>{
    const {wait,value} = state
    if (wait===false && value===searchFor){
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
      placeholder={placeholder}
      value={state.value}
      sx={{
        flex:1,
        minWidth: ['inherit', '20.5rem', '19.5rem']
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
          <SearchIcon sx={{cursor:'pointer'}} onClick={()=>onSearch(searchFor)} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="start">
          {searchFor ?
            <ClearIcon
              sx={{cursor:'pointer'}}
              onClick={()=>{
                setState({
                  value:'',
                  wait:false
                })
              }}
            />
            :null
          }
        </InputAdornment>
      }
    />
  )
}
