const mongoose=require('mongoose')

// const commentschema=new mongoose.Schema({
//     username:String,
//     comment:String,
//     rating:Number
// })
// const productschema=new mongoose.Schema({
//     p_id:String,
//     //comments:[commentschema],
// })
// const cartschema=new mongoose.Schema({
//     name:String,
//     price:Number,
//     image:String,
//     qnt:Number,
// })
const userschema=new mongoose.Schema({
    name:String,
    pass:String,
    mail:String,
    cart:[String],
    product:[String]
})
const User=mongoose.model('User',userschema)
module.exports=User