const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("connected to DB")
})
.catch(()=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    const user = await User.findOne();
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:user ,
    }));
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB();