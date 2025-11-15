const express = require('express')
const { registerUser, login, getUserById, getUserResume } = require('../controllers/userController')
const {protect} = require('../middlewares/authMiddleware')

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', login)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResume)

module.exports = userRouter;