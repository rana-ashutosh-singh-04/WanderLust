const { defaults } = require('figlet');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema ({
    title:{
        type:String,
        required: true,
    },
    description: {
        type:String,
    },
    image:{
        filename:String,
        url:{
          type:String,
        default: "https://images.unsplash.com/photo-1750128839549-d918cc10dc6a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1OXx8fGVufDB8fHx8fA%3D%3D",
        set:(v) =>
             v ===""
               ? "https://images.unsplash.com/photo-1750128839549-d918cc10dc6a?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1OXx8fGVufDB8fHx8fA%3D%3D"
                : v,
    }
        }
       ,
    price:Number,
    location: String,
    country: String,


})


const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;