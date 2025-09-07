const mongoose = require('mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
})

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", userSchema);