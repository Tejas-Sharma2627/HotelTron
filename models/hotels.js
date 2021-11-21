const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const hotelsSchema = new Schema({
    name:String,
    image: String,
    price:Number,
    descr:String,
    location: String
});


module.exports=mongoose.model('Hotels',hotelsSchema);