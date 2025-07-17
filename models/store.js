const mongoose=require('mongoose')
const storeschema=new mongoose.Schema({
    userid:String,
    name:String,
    price:Number,
    image:String,
    quantity:Number,
    description:String,
})
const Store=mongoose.model('Store',storeschema)
module.exports=Store