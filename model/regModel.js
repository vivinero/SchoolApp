const mongoose = require("mongoose")
const regSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["Teacher", "Student"],
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const regModel = mongoose.model("school", regSchema)
module.exports = regModel