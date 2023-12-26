const mongoose = require("mongoose")
require("dotenv").config()

const database = process.env.apiLink


mongoose.connect(database).then(()=> {

    console.log(`database successful`)

}).catch((e)=>{
    console.log(e.message)
})
