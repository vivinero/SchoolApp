const scoreModel = require('../model/scoreModel')
const regModel = require("../model/regModel")

exports.addScore = async (req, res)=>{
    try {
        const {studentId, score}= req.body

        //check if student is registered or valid

        const student = await regModel.findById(studentId)
        if (!student || student.role != "Student") {
            return res.status(401).json({
                mesage: `Student not found`
            })
        }

        const existingScore = new scoreModel({studentId})
        //update the scorre for the subject 
        if (score.math) {
            existingScore.maths += score.math
        }
        if (score.english) {
            existingScore.english += score.english
        }

        //save the score

        await existingScore.save()
        //thrroww a succeess message
        res.status(200).json({
            message: `score added successfully`,
            data: existingScore
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getStudentScore = async (req, res)=> {
    try {
        const {studentId}  = req.body
        //check if student is VALID
        const student = await regModel.findOne(studentId)
        if (!student || student.role != student) {
            return res.status(401).json({ 
                message: `student not found`
            })
        }
        //fetch student scores
        const studentScore = await scoreModel.findOne({studentId})
        if (!studentScore) {
           return res.status(401).json({
            message: `student scores not found`
           }) 
        }
        //calculate the total average of the student 
        const totalScore = studentScore.maths + studentScore.english
        const totalSubject = 2
        const averageScore = totalScore/totalSubject

        //throw a success response
        return res.status(200).json({
            message: `Yo! here is an average`,
            student,
            studentScore,
            averageScore,
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateUser = async (req, res)=> {
    try {
        const studentId = req.params.studentId
        const scores = req.body.scores
        const student = await regModel.findOne({studentId})
        //check if the student is valid
        if (!student) {
            return res.status(403).json({
                message: `unable to get scores`
            })
        }

        //use find by id and update to update the score
        const options = {new: true, upsert: true};
        const updatedScore = await scoreModel.findOneAndUpdate({studentId},{$set: scores}, options)
        return res.status(200).json({
            message: `scores update successfully`,
            updatedScore,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const studentId = req.params.studentId
        //check if student is valid
        const student = scoreModel.findOne({studentId})
        if (!student || student.role !== "Student") {
            return res.status(401).json({
                message: `student not found`,
            })
        }
        //fetch the score for the student
        const studentScore = await scoreModel.findOneAndDelete({studentId})
        
        //also delet the student details for the student
        await regModel.findByIdAndDelete(studentId)
        res.status(200).json({
            message: `students scores and data deleted successfully`,
            data: studentScore
        })

    } catch (error) {
        res.status(500).json({
            message: error.mesage
        })
    }
}