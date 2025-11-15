const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const resumeModel = require('../models/resumeModel');

const generateToken = (userId) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: '7d'})
  return token;
}



// controller for user registration
// POST : /api/users/register

const registerUser = async (req,res) => {
  try {

    const {name, email, password } = req.body;

    // check if required fields are present
    if(!name || !email || !password){
      return res.status(400).json({msg:'Fills all the fields'})
    }

    // check if user already exists
    const user = await userModel.findOne({email})
    if(user){
      return res.status(400).json({msg:'User already Exist'})
    }

    // create new user
    const hashedpassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({
      name :name,
      email : email,
      password : hashedpassword
    })

    // return success msg
    const token = generateToken(newUser._id)
    newUser.password = undefined;
    
    return res.status(201).json({msg:'User Created Successfully', token, user:newUser})
     
  } catch (error) {
    return res.status(400).json({msg:error.message})
  }
}



// controller for User Login
// POST : /api/users/login

const login = async (req,res) => {
  try {

    const { email, password } = req.body;

    // check if user exists
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(400).json({msg:'Invalid Username or Password'})
    }

    // check if password is currect 
    if(!user.comparePassword(password)){
      return res.status(400).json({msg:'Invalid Username or Password'})
    }

    // return success msg
    const token = generateToken(user._id)
    user.password = undefined;
    
    return res.status(200).json({msg:'Login Successfully', token, user})
     
  } catch (error) {
    return res.status(400).json({msg:error.message})
  }
}


// controller for getting user data by id 
// GET : /api/users/data

const getUserById = async (req,res) => {
  try {

    const userId = req.userId;

    // check if user exist
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(400).json({msg:"User Not Found"})
    }

    // return user
    user.password = undefined;
    return res.status(200).json({user})
     
  } catch (error) {
    return res.status(400).json({msg:error.message})
  }
}

// controller for getting users resume
// GET : /api/users/resumes

const getUserResume = async (req,res) => {
  try {
    
    const userId = req.userId;

    // return users resumes
    const resume = await resumeModel.find({userId})
    return res.status(200).json({resume})

  } catch (error) {
    return res.status(400).json({msg:error.message})
  }
}


module.exports = {registerUser, login, getUserById, getUserResume}