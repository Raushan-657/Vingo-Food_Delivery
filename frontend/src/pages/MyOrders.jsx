import axios from 'axios';
import { useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import OwnerOrderCard from '../components/OwnerOrderCard';
import UserOrderCard from '../components/UserOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';


function MyOrders() {
  const { userData, myOrders,socket} = useSelector(state => state.user)
  const navigate = useNavigate()
const dispatch=useDispatch()

  // Fetch my orders on component mount
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/get-my-orders`, {withCredentials: true})
        dispatch(setMyOrders(result.data || []))
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data?.message || error.message)
      }
    }
    
    if(userData) {
      fetchMyOrders()
    }
  }, [userData, dispatch])

  useEffect(()=>{
    if(!socket || !userData) return;

    const handleNewOrder = (data) => {
      // Check if this order belongs to the current owner (for owners)
      if(userData.role === "owner" && data.shopOrders?.owner?._id === userData._id){
        dispatch(setMyOrders([data,...myOrders]))
      }
    }

    const handleUpdateStatus = ({orderId,shopId,status,userId}) => {
      if(userId === userData._id || userData.role === "owner"){
        dispatch(updateRealtimeOrderStatus({orderId,shopId,status}))
      }
    }

    const handleOrderDelivered = ({orderId, shopId, shopOrderId, status}) => {
      // Update order status when delivery is completed
      dispatch(updateRealtimeOrderStatus({orderId, shopId, status}))
    }

    socket.on('newOrder', handleNewOrder)
    socket.on('update-status', handleUpdateStatus)
    socket.on('order-delivered', handleOrderDelivered)

    return () => {
      socket.off('newOrder', handleNewOrder)
      socket.off('update-status', handleUpdateStatus)
      socket.off('order-delivered', handleOrderDelivered)
    }
  },[socket, userData, myOrders, dispatch])



  
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>

        <div className='flex items-center gap-[20px] mb-6 '>
          <div className=' z-[10] ' onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
          </div>
          <h1 className='text-2xl font-bold  text-start'>My Orders</h1>
        </div>
        <div className='space-y-6'>
          {myOrders?.map((order,index)=>(
            userData.role=="user" ?
            (
              <UserOrderCard data={order} key={index}/>
            )
            :
            userData.role=="owner"? (
              <OwnerOrderCard data={order} key={index}/>
            )
            :
            null
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
