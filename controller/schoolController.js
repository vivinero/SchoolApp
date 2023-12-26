const schoolModel = require("../model/regModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res)=> {
    try {
        const {name, email, password, role}= req.body
        const lowerCase = email.toLowerCase()
        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password, salt)

        const user = new schoolModel({name, email: lowerCase, password: hash, role})

        const token = jwt.sign({email:user.email, userId:user._id},process.env.jsonSecret, {expiresIn: "1d"})
        const savedUser = await user.save()
        return res.status(200).json({
            message: `Hi you have successfully registered`,
            data: savedUser,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req, res)=> {
    try {
        const {email, password}= req.body
        const user = await schoolModel.findOne({email})
        if (!user) {
            return res.status(404).json({
                message: `This email already exist`,
            })   
        }

        checkUserPass = bcrypt.compareSync(password, user.password)
        
        if (!checkUserPass) {
            return res.status(404).json({
                message: `incorrect password`
            })
        }
        if (user.role === "Teacher" ) {
            user.isAdmin = true
            await user.save()
        }

        user.isLoggedIn = true
        await user.save()
        
            const token = jwt.sign({
                email: user.email,
                userId: user._id,
                role: user.role,
                isLoggedIn: user.isLoggedIn

            }, process.env.jsonSecret, {expiresIn: "1d"})
            res.status(200).json({
                message: `login successful`,
                token, 
                user
            })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getall = async (req, res)=> {
    try {
        const user = await schoolModel.find()
        if (user.length === 0) {
            return res.status(404).json({
                message: `no user found`
            })
        }
        return res.status(200).json({
            message: `These are the users`,
            user
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.findone = async (req, res)=> {
    try {
        const id = req.params.id
        const user = await schoolModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: `Unable to find user`
            })
        }
        return res.status(200).json({
            message: `Yeppi! user with ${user.email} has been found`,
            user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.update = async (req, res)=> {
    try {
        const userId = req.params.id
        const data = {
            name: req.body.name,
            email: req.body.email
        }
        const updateUser = await schoolModel.findByIdAndUpdate(userId, data, {new:true})
        if (!updateUser) {
            res.status(403).json({
                message: `unable to update user `
            })
            
        }
        res.status(201).json({
            message: `user with has been updated successfully`,
            updateUser,
        })
    } catch (error) {
        res.json(error.message)
    }
}
exports.deleteUser = async (req, res)=> {
    try {
        const id = req.params.id
        const user = await schoolModel.findByIdAndDelete(id)

        if (!user) {
            return res.status(403).json({
                message: `Unable to find user`
            })
        }
        return res.status(200).json({
            message: `User with has been deleted successfully`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


