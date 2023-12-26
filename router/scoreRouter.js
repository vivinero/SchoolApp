const express = require("express")
const router = express.Router()
const scoreRouter = require("../controller/scoreController")
const { authenticate, role  }= require("../middleware/auth")

router.post('/addscore', authenticate, role, scoreRouter.addScore)
router.get('/getstudentscore',  scoreRouter.getStudentScore)
router.put('/updateuser/:id',  scoreRouter.updateUser)
router.delete('/deleteuser/:id',  scoreRouter.delete)

module.exports = router