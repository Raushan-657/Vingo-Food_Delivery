import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetShopByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
  if(!currentCity) {
    dispatch(setShopsInMyCity([]))
    return
  }
  
  const fetchShops=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
            dispatch(setShopsInMyCity(result.data || []))
           console.log("Shops fetched:", result.data)
    } catch (error) {
        console.error("Error fetching shops:", error)
        dispatch(setShopsInMyCity([]))
    }
}
fetchShops()
 
  },[currentCity])
}

export default useGetShopByCity
