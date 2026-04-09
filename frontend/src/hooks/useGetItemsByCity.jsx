import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
  if(!currentCity) {
    dispatch(setItemsInMyCity([]))
    return
  }
  
  const fetchItems=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
            dispatch(setItemsInMyCity(result.data || []))
           console.log("Items fetched:", result.data)
    } catch (error) {
        console.error("Error fetching items:", error)
        dispatch(setItemsInMyCity([]))
    }
}
fetchItems()
 
  },[currentCity])
}

export default useGetItemsByCity
