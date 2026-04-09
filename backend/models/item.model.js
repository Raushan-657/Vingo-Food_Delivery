import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    category: {
        type: String,
        enum: ["Snacks",
            "Main Course",
            "Desserts",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "Others"
        ],
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    foodType:{
        type:String,
        enum:["veg","non veg"],
        required:true,
        set: (value) => value ? value.toLowerCase() : value
    },
   rating:{
    average:{type:Number,default:0},
    count:{type:Number,default:0}
   }
}, { timestamps: true })

// Pre-save hook to normalize foodType
itemSchema.pre('save', function(next) {
    if(this.foodType) {
        this.foodType = this.foodType.toLowerCase()
    }
    next()
})

// Pre-findByIdAndUpdate hook to normalize foodType
itemSchema.pre('findByIdAndUpdate', function(next) {
    const update = this.getUpdate()
    if(update.foodType) {
        update.foodType = update.foodType.toLowerCase()
    }
    if(update.$set && update.$set.foodType) {
        update.$set.foodType = update.$set.foodType.toLowerCase()
    }
    next()
})

const Item=mongoose.model("Item",itemSchema)
export default Item