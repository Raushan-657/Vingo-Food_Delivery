import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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

export const createEditShop=async (req,res) => {
    try {
       const {name,city,state,address}=req.body
       let image;
       if(req.file){
        console.log(req.file)
        image=await uploadOnCloudinary(req.file.path)
       } 
       let shop=await Shop.findOne({owner:req.userId})
       if(!shop){
        shop=await Shop.create({
        name,city,state,address,image,owner:req.userId
       })
       }else{
         shop=await Shop.findByIdAndUpdate(shop._id,{
        name,city,state,address,image,owner:req.userId
       },{new:true})
       }
      
       await shop.populate("owner items")
       return res.status(201).json(shop)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error("Create/Edit shop error:", errorMessage, error)
        return res.status(500).json({message:`create shop error: ${errorMessage}`})
    }
}

export const getMyShop=async (req,res) => {
    try {
        const shop=await Shop.findOne({owner:req.userId}).populate("owner").populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        if(!shop){
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error("Get my shop error:", errorMessage, error)
        return res.status(500).json({message:`get my shop error: ${errorMessage}`})
    }
}

export const getShopByCity=async (req,res) => {
    try {
        const {city}=req.params

        const shops=await Shop.find({
            city:{$regex:new RegExp(`^${city}$`, "i")}
        }).populate('items')
        if(!shops){
            return res.status(400).json({message:"shops not found"})
        }
        return res.status(200).json(shops)
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error("Get shop by city error:", errorMessage, error)
        return res.status(500).json({message:`get shop by city error: ${errorMessage}`})
    }
}