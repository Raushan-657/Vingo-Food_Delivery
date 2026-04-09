import User from "../models/user.model.js"

// Helper function to extract error message from various error types
const getErrorMessage = (error) => {
    if (!error) return 'Unknown error'
    if (typeof error === 'string') return error
    if (error.message) return error.message
    if (error.description) return error.description
    if (error.statusCode) return `HTTP ${error.statusCode}`
    if (error.error) return error.error
    try {
        return JSON.stringify(error)
    } catch {
        return 'Unknown error'
    }
}

export const getCurrentUser=async (req,res) => {
    try {
        const userId=req.userId
        if(!userId){
            return res.status(400).json({message:"userId is not found"})
        }
        const user=await User.findById(userId)
        if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error("Get current user error:", errorMessage, error)
        return res.status(500).json({message:`get current user error: ${errorMessage}`})
    }
}

export const updateUserLocation=async (req,res) => {
    try {
        const {lat,lon}=req.body
        const user=await User.findByIdAndUpdate(req.userId,{
            location:{
                type:'Point',
                coordinates:[lon,lat]
            }
        },{new:true})
         if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        
        return res.status(200).json({message:'location updated'})
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error("Update user location error:", errorMessage, error)
        return res.status(500).json({message:`update location user error: ${errorMessage}`})
    }
}

