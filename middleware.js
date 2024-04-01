const User=require('./db');

const jwt=require('jsonwebtoken');
require('dotenv').config();
const authMiddleware=(req,res,next) => {
    const authHeader=req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
    
    

} 
module.exports=authMiddleware;