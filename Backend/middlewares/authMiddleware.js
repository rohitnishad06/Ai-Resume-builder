const jwt = require("jsonwebtoken");


const protect = (req, res, next) => {

  const token = req.headers.authorization;
  if(!token){
    return res.status(401).json({msg:"Unauthorized" });
  }

  try {

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decode.userId;
    next();
    
  } catch (error) {
        return res.status(401).json({msg:"Unauthorized" });
  }
}

module.exports = {protect}