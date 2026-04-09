import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAddress, setLocation } from '../redux/mapSlice'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'

function useGetCity() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
if(!userData) return;

const getLocationAndCity = async (position) => {
    try {
        const latitude=position.coords.latitude
        const longitude=position.coords.longitude
        dispatch(setLocation({lat:latitude,lon:longitude}))
        const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
        if(result?.data?.results && result.data.results.length > 0) {
            dispatch(setCurrentCity(result.data.results[0].city || result.data.results[0].county))
            dispatch(setCurrentState(result.data.results[0].state))
            dispatch(setCurrentAddress(result.data.results[0].address_line2 || result.data.results[0].address_line1))
            dispatch(setAddress(result.data.results[0].address_line2))
        }
    } catch (error) {
        console.error("Error getting location:", error)
    }
}

const handleLocationError = (error) => {
    console.warn("Geolocation error:", error)
    // Fallback to a default city if location is denied
    dispatch(setCurrentCity("Delhi"))
    dispatch(setCurrentState("Delhi"))
}

navigator.geolocation.getCurrentPosition(getLocationAndCity, handleLocationError)
    },[userData])
}

export default useGetCity
