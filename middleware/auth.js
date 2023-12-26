const schoolModel = require("../model/regModel")
const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next)=> {
    try {
        const isAuthorized = req.headers.authorization
        if (!isAuthorized) {
           return res.status(404).json({
            message: `user's authorization token not found`
           }) 
        }

        const token = isAuthorized.split(" ")[1]
        if (!token) {
            return res.status(404).json({
                message: `authorization: token not found`
            })
        }
        const decodedToken = jwt.verify(token, process.env.jsonSecret)
        const user = await schoolModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(404).json({
                message: `No user found`
            })
        }
        if (user.isLoggedIn === false) {
            return res.status(403).json({
                message: `This user is logged out.`
            })
        }
    //    else if (user.role === "Student") {
    //         return res.status(403).json({
    //             message: `Oops! you are not an teacher`
    //         })
    //     }
        req.user = decodedToken

        next()

        
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            message: `session expired`
        }
        res.status(500).json({
            message: error.message
        })
    }
}

const role = async (req, res, next)=> {
    try {
        if (req.user.role === "Teacher") {
            next()
        }else{
          res.status(401).json({
            message: `you are not allowed to perform this function`
          })  
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {authenticate, role}













