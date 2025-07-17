const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    name:String,
    pass:String,
    mail:String,
    cart:[String],
    product:[String]
})
const User=mongoose.model('User',userschema)
module.exports=User