const express = require("express")
const router = express.Router()
const { register, login, getall, findone, update, deleteUser } = require("../controller/schoolController")
const {authenticate, role} = require("../middleware/auth")
// const authenticate = require("../authentication/authorization.js")


router.post("/register", register)
router.post("/login", login)
router.get("/getall", authenticate, role, getall)
router.get("/findone/:id", findone)
router.put("/update/:id", authenticate, update)
router.delete("/delete/:id", authenticate, deleteUser)


module.exports = router
